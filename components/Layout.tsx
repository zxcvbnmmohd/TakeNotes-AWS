import React, { ReactNode, useState, useEffect } from 'react'
import { Auth } from 'aws-amplify'
import Link from 'next/link'
import Head from 'next/head'
import Modal from './Modal'

interface User {
  username: string
}

type Props = {
  children?: ReactNode
  title?: string
}

const Layout = ({ children, title = 'This is the default title' }: Props) => {
  const [user, setUser] = useState<User>(null)
  const [values, setValues] = useState({
    username: '',
    password: '',
    email: '',
    phone: '',
    code: '',
  })

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        console.log('User: ', user)
        setUser(user)
      })
      .catch((err) => setUser(null))
  }, [])

  const handleOnLogin = async () => {
    try {
      const user = await Auth.signIn(values.username, values.password);
      console.log(user);
      window.location.reload();
    } catch (error) {
      console.log('error signing in', error);
    }
  }

  const handleOnRegister = async () => {
    try {
      const { user } = await Auth.signUp({
        username: values.username,
        password: values.password,
        attributes: {
          email: values.email,
        }
      });
      console.log(user);
    } catch (error) {
      console.log('error signing up:', error);
    }
  }

  const handleOnLogout = async () => {
    try {
      await Auth.signOut();
      window.location.reload();
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header>
        <nav className="relative flex flex-wrap items-center justify-between px-2 py-3 bg-pink-500 mb-3">
          <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
            <div className="w-full relative flex justify-between lg:w-auto  px-4 lg:static lg:block lg:justify-start">
              <a
                className="text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-white"
                href="#pablo"
              >
                TakeNotes / AWS
              </a>
              <button
                className="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
                type="button"
              >
                <span className="block relative w-6 h-px rounded-sm bg-white"></span>
                <span className="block relative w-6 h-px rounded-sm bg-white mt-1"></span>
                <span className="block relative w-6 h-px rounded-sm bg-white mt-1"></span>
              </button>
            </div>
            <div
              className="lg:flex flex-grow items-center"
              id="example-navbar-warning"
            >
              {user == null ? (
                <ul className="flex flex-col lg:flex-row list-none ml-auto">
                  <li className="nav-item">
                    <div className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white">
                      <Modal text="LOGIN">
                        <form
                        // onSubmit={async (e) => {
                        //   e.preventDefault();
                        // }}
                        >
                          <div className="relative w-full mb-3">
                            <label
                              className="block uppercase text-gray-700 text-xs font-bold mb-2"
                              htmlFor="grid-password"
                            >
                              Username
                            </label>
                            <input
                              className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                              type="username"
                              placeholder="Username"
                              onChange={e => setValues({ ...values, 'username': e.target.value })}
                              style={{ transition: "all .15s ease" }}
                            />
                          </div>

                          <div className="relative w-full mb-3">
                            <label
                              className="block uppercase text-gray-700 text-xs font-bold mb-2"
                              htmlFor="grid-password"
                            >
                              Password
                            </label>
                            <input
                              className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                              type="password"
                              placeholder="Password"
                              onChange={e => setValues({ ...values, 'password': e.target.value })}
                              style={{ transition: "all .15s ease" }}
                            />
                          </div>

                          <div className="text-center mt-6">
                            <button
                              className="bg-gray-900 text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full"
                              type="button"
                              style={{ transition: "all .15s ease" }}
                              onClick={() => handleOnLogin()}
                            >
                              Login
                            </button>
                          </div>
                        </form>
                      </Modal>
                    </div>
                  </li>
                  <li className="nav-item">
                    <div className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white">
                      <Modal text="REGISTER">
                        <form
                        // onSubmit={async (e) => {
                        //   e.preventDefault();
                        // }}
                        >
                          <div className="relative w-full mb-3">
                            <label
                              className="block uppercase text-gray-700 text-xs font-bold mb-2"
                              htmlFor="grid-password"
                            >
                              Email
                            </label>
                            <input
                              className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                              type="email"
                              placeholder="Email"
                              onChange={e => setValues({ ...values, 'email': e.target.value })}
                              style={{ transition: "all .15s ease" }}
                            />
                          </div>

                          <div className="relative w-full mb-3">
                            <label
                              className="block uppercase text-gray-700 text-xs font-bold mb-2"
                              htmlFor="grid-password"
                            >
                              Username
                            </label>
                            <input
                              className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                              type="username"
                              placeholder="Username"
                              onChange={e => setValues({ ...values, 'username': e.target.value })}
                              style={{ transition: "all .15s ease" }}
                            />
                          </div>

                          <div className="relative w-full mb-3">
                            <label
                              className="block uppercase text-gray-700 text-xs font-bold mb-2"
                              htmlFor="grid-password"
                            >
                              Password
                            </label>
                            <input
                              className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                              type="password"
                              placeholder="Password"
                              onChange={e => setValues({ ...values, 'password': e.target.value })}
                              style={{ transition: "all .15s ease" }}
                            />
                          </div>

                          <div className="text-center mt-6">
                            <button
                              className="bg-gray-900 text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full"
                              type="button"
                              style={{ transition: "all .15s ease" }}
                              onClick={() => handleOnRegister()}
                            >
                              Register
                            </button>
                          </div>
                        </form>
                      </Modal>
                    </div>
                  </li>
                </ul>
              ) : (
                <ul className="flex flex-col lg:flex-row list-none ml-auto">
                  <li className="nav-item">
                    <div
                      className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                      onClick={() => handleOnLogout()}
                    >
                      <Link href="#">LOGOUT</Link>
                    </div>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </nav>
        {/* <nav>
        <Link href="/">
          <a>Home v2</a>
        </Link>{' '}
        |{' '}
        <Link href="/protected">
          <a>Protected</a>
        </Link>{' '}
        |{' '}
        <Link href="/protected-client-route">
          <a>Protected Client Route</a>
        </Link>{' '}
        |{' '}
        <Link href="/about">
          <a>About</a>
        </Link>{' '}
        |{' '}
        <Link href="/users">
          <a>Users List</a>
        </Link>{' '}
        |{' '}
        <Link href="/api/users">
          <a>Users API</a>
        </Link>
      </nav> */}
      </header>
      {children}
      <footer>
        <hr />
        <span>El Footer</span>
      </footer>
    </div>
  )
}

export default Layout
