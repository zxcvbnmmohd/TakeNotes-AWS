import { useState, useEffect } from 'react'
import { Auth } from 'aws-amplify'
import Layout from '../components/Layout'

interface User {
  username: string;
}

const IndexPage = () => {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(user => {
        console.log("User: ", user)
        setUser(user)
      })
      .catch(err => setUser(null))
  }, []);

  return (
    <Layout title="Home | Next.js + TypeScript Example">
      <div className="flex justify-center w-full mt-[64px]">
        <div className="flex flex-col justify-center max-w-3/5">
          <div className="text-center text-5xl font-bold">
            👋 Hey {user == null ? 'Next.JS' : user.username} !
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default IndexPage
