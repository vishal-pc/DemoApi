// password validation
export const passwordRegex =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

// email validation
export const emailValidate = (email) => {
  if (
    String(email).match(
      /^[A-Za-z0-9._%-]+@(?:[A-Za-z0-9]+\.)+(com|co\.in|yahoo\.com)$/
    )
  ) {
    return true;
  } else {
    return false;
  }
};
