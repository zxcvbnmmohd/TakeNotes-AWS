import Amplify, { withSSRContext } from "aws-amplify";
import config from "../../aws-exports";

Amplify.configure({ ...config, ssr: true });

export default async (req, res) => {
  const { Auth } = withSSRContext({ req });
  try {
    const user = await Auth.currentAuthenticatedUser();
    console.log(user);
    res.json({ user: user });
  } catch (err) {
    res.statusCode = 200;
    res.json({ user: null });
  }
};
