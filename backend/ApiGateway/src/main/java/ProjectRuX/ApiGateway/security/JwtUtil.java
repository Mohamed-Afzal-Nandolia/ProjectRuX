//package ProjectRuX.ApiGateway.security;
//
//import io.jsonwebtoken.*;
//import io.jsonwebtoken.security.Keys;
//import org.springframework.stereotype.Component;
//
//import java.security.Key;
//import java.util.Date;
//
//@Component
//public class JwtUtil {
//
//    private static final String SECRET = "mysecretkeymysecretkeymysecretkey12345"; // 32+ chars
//    private static final long EXPIRATION_TIME = 24 * 60 * 60 * 1000;
//
//    private Key getKey() {
//        return Keys.hmacShaKeyFor(SECRET.getBytes());
//    }
//
//    public Claims validateToken(String token) throws JwtException {
//        return Jwts.parserBuilder()
//                .setSigningKey(getKey())
//                .build()
//                .parseClaimsJws(token)
//                .getBody();
//    }
//}
