
export function clearAllUserCookies() {
  useHashedCookie("b35db0c4e3bb4").value = null; // userId
  useHashedCookie("f4720e4c4ca84").value = null; // userFullName
  useHashedCookie("ef8bb5c379f34").value = null; // userName
  useHashedCookie("f8cd3228568c4").value = null; // userProfileImage
  useHashedCookie("3c19312bc3e34").value = null; // userEmail
  useHashedCookie("aa05f44d53a34").value = null; // userRole
  useHashedCookie("c967092aae604").value = null; // userPhone
  useHashedCookie("c96434292aae604").value = null; // userToken
}
