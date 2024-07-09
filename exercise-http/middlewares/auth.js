const jwt = require( "jsonwebtoken" );
const ModelPlageUser = require('../model/ModelPlageUser')
const { tokenList } = require('../controller/ControllerPlageUserAPI')

exports.isAuth = async( req, res, next ) => {
  try {
    if ( req.headers.cookie ) {
      const cookies = req.headers.cookie.split( ";" );
      let foundToken = false;
      let tokenExpired = false;
      let refreshToken;
      cookies.forEach( ( cookie ) => {
        const cookieArray = cookie.split( "=" );
        let key;
        if ( cookieArray[ 0 ][ 0 ] === " " ) {
          key = cookieArray[ 0 ].substring( 1 );
        } else {
          key = cookieArray[ 0 ];
        }

        if ( key === "access_token" ) {
          foundToken = true;
          const token = cookieArray[ 1 ];
          try {
            req.session = jwt.verify( token, process.env.SECRET_JWT );
            if (req.session.locale == undefined) {
              req.session.locale = "en";
            }
            next();
          } catch ( err ) {
            if(err.name === "TokenExpiredError"){
              tokenExpired = true
            }
          }
        }
        if(key === "refresh_token") {
          refreshToken = cookieArray[ 1 ]
        }
      } );
      if(!foundToken || tokenExpired){ // No token or expired : We check if we want to give them a new one
        if(refreshToken){
          try{
            const previousToken = jwt.verify(tokenList[refreshToken].access_token, process.env.SECRET_JWT)
            // If we got to this point, this means the user has no access_token but the previous one is still active
            // Thus, we can not guarantee this is a legitimate user
            // TODO : Unvalidate refresh_token as it may be stolen.
              res.status( 403 ).json({message: "Connection refused by the server"})
          }catch(err){
            if(err.name == 'TokenExpiredError'){ // If previous token expired they might be a legitimate user
              // Give new token
              try{
                const decoded = jwt.verify(refreshToken, process.env.SECRET_JWT);
                const resp = await ModelPlageUser.getUserByEmailId(decoded.email);
                const data = {
                  user_id: resp.user_id,
                  email: resp.email,
                  lastname: resp.lastname,
                  firstname: resp.firstname,
                  locale: resp.locale,
                  role_id: resp.role_id
                };
                let access_token_expiration = process.env.ACCESS_TOKEN_DURATION || "300000"
                const token = jwt.sign(data, process.env.SECRET_JWT, { expiresIn: access_token_expiration });
                tokenList[refreshToken] = { access_token: token, refresh_token: refreshToken };
                res.cookie("access_token", token, { maxAge: access_token_expiration, httpOnly: true, SameSite: "Strict" })
                req.session = data
                next();
              }catch(err){
                res.status( 403 ).json({message: "Refresh token expired"})
              }
              
            }else{
              res.status( 500 ).json({message: "Server error analyzing the token"})
            }
          }
        }else{
          throw 'Unauthenticated'
        }
      }
    }
  } catch ( error ) {
    res.status( 401 ).json( { message: error } );
  }
};
