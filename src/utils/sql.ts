const SqlCommands = /select|insert|update|delete|where/gi;
const SqlFields = /\*|username|password|hashedPassword|appid/gi;
const SqlComments = /#|--/gi;
const SqlOthers = /into|values|from|;/gi;

export const scrapeSqlInjection = (
  username: string,
  password: string,
  appid: string,
  redirectBase: string
): [string, string, string, string] => {
  let scrapedUsername = username.replace(SqlCommands, "");
  scrapedUsername = scrapedUsername.replace(SqlFields, "");
  scrapedUsername = scrapedUsername.replace(SqlComments, "");
  scrapedUsername = scrapedUsername.replace(SqlOthers, "");

  let scrapedPassword = password.replace(SqlCommands, "");
  scrapedPassword = scrapedPassword.replace(SqlFields, "");
  scrapedPassword = scrapedPassword.replace(SqlComments, "");
  scrapedPassword = scrapedPassword.replace(SqlOthers, "");

  let scrapedAppid = appid.replace(SqlCommands, "");
  scrapedAppid = scrapedAppid.replace(SqlFields, "");
  scrapedAppid = scrapedAppid.replace(SqlComments, "");
  scrapedAppid = scrapedAppid.replace(SqlOthers, "");

  let scrapedRedirectBase = redirectBase.replace(SqlCommands, "");
  scrapedRedirectBase = scrapedRedirectBase.replace(SqlFields, "");
  scrapedRedirectBase = scrapedRedirectBase.replace(SqlComments, "");
  scrapedRedirectBase = scrapedRedirectBase.replace(SqlOthers, "");

  return [scrapedUsername, scrapedPassword, scrapedAppid, scrapedRedirectBase];
};
