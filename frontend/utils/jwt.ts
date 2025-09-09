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

function decodeToken(): JwtPayload | null {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    if (decoded.exp * 1000 > Date.now()) {
      return decoded;
    } else {
      localStorage.removeItem("token");
      return null;
    }
  } catch (err) {
    console.error("Failed to decode token", err);
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
