import { jwtDecode } from "jwt-decode";

export type JwtPayload = {
  sub: string;
  username: string;
  email: string;
  exp: number;
};

// export function decodeToken(token: string): JwtPayload | null {
//   try {
//     return jwtDecode<JwtPayload>(token);
//   } catch (err) {
//     console.error("Failed to decode token:", err);
//     return null;
//   }
// }

function getToken(): string | null {
  return localStorage.getItem("token");
}

let cachedToken: { token: string; decoded: JwtPayload; timestamp: number } | null = null;
const CACHE_DURATION = 30000; // 30 seconds

function decodeToken(): JwtPayload | null {
  const token = getToken();
  if (!token) {
    cachedToken = null;
    return null;
  }

  // Check if we have a valid cached result
  if (cachedToken && 
      cachedToken.token === token && 
      Date.now() - cachedToken.timestamp < CACHE_DURATION) {
    return cachedToken.decoded;
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    if (decoded.exp * 1000 > Date.now()) {
      // Cache the result
      cachedToken = {
        token,
        decoded,
        timestamp: Date.now()
      };
      return decoded;
    } else {
      localStorage.removeItem("token");
      cachedToken = null;
      return null;
    }
  } catch (err) {
    console.error("Failed to decode token", err);
    cachedToken = null;
    return null;
  }
}

export function getUserId(): string | null {
  const decoded = decodeToken();
  return decoded?.sub || null;
}

export function getUsername(): string | null {
  const decoded = decodeToken();
  return decoded?.username || null;
}

export function getUserEmail(): string | null {
  const decoded = decodeToken();
  return decoded?.email || null;
}

export function clearTokenCache(): void {
  cachedToken = null;
}
