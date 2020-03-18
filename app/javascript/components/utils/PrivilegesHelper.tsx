export function checkPrivileges(userPrivileges, privilegeName) {
  var result = userPrivileges.filter((obj) => {
    return obj.name === privilegeName;
  });
  return result[0]?.privilege_state || null;
}
