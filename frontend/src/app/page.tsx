"use client";

import { signIn } from "next-auth/react";
import { getSession } from "@/lib/auth";
import { useEffect, Fragment } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    getSession().then((val) => {
      if (val) router.replace("/project");
    });
  }, [router]);

  return (
    <Fragment>
      {/* <!-- Logo --> */}
      <a
        href="index.html"
        className="absolute top-6 left-12 text-accent font-bold text-lg no-underline md:top-4 md:left-4"
      >
        <span className="text-white">Code Push Server</span>
      </a>

      <div className="w-full max-w-[900px] flex bg-card-bg rounded-lg overflow-hidden shadow-2xl border border-white/5 relative md:flex-col">
        {/* <!-- Main content --> */}
        <div className="w-3/5 p-12 flex flex-col justify-center md:w-full md:p-8 md:order-1">
          <div className="mb-8 text-center">
            <h2 className="text-4xl mb-2">Welcome Back</h2>
            <p className="text-secondary-text">
              Please enter your details to sign in
            </p>
          </div>

          <form className="flex flex-col gap-6">
            {/* <LoginForms /> */}

            <button
              type="button"
              className="flex items-center justify-center gap-3 p-3 bg-white/5 border border-white/10 rounded-md text-white font-medium cursor-pointer transition-all hover:bg-white/10"
              onClick={() => signIn("google")}
            >
              <span className="flex items-center justify-center">
                <svg
                  width="18"
                  height="18"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#4285F4"
                    d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"
                  />
                  <path
                    fill="#EA4335"
                    d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
                  />
                </svg>
              </span>
              Continue with Google
            </button>
          </form>

          {/* <div className="mt-8 text-center text-sm text-secondary-text">
            Don't have an account?{" "}
            <a href="#" className="text-accent no-underline">
              Sign up
            </a>
          </div> */}
        </div>
      </div>
    </Fragment>
  );
};

export default Page;

// const LoginForms = () => {
//   return (
//     <Fragment>
//       <div className="flex flex-col gap-2">
//         <label htmlFor="email" className="text-sm text-secondary-text">
//           Email
//         </label>
//         <input
//           type="email"
//           id="email"
//           className="p-3 bg-white/5 border border-white/10 rounded-md text-white text-base transition-all focus:outline-none focus:border-accent focus:shadow-[0_0_0_2px_rgba(78,205,196,0.2)]"
//           placeholder="Enter your email"
//         />
//       </div>

//       <div className="flex flex-col gap-2">
//         <label htmlFor="password" className="text-sm text-secondary-text">
//           Password
//         </label>
//         <input
//           type="password"
//           id="password"
//           className="p-3 bg-white/5 border border-white/10 rounded-md text-white text-base transition-all focus:outline-none focus:border-accent focus:shadow-[0_0_0_2px_rgba(78,205,196,0.2)]"
//           placeholder="Enter your password"
//         />
//       </div>

//       <div className="flex justify-between text-sm">
//         <label className="flex items-center gap-2">
//           <input type="checkbox" className="rounded" /> Remember me
//         </label>
//         <a
//           href="#"
//           className="text-secondary-text no-underline hover:text-accent transition-colors"
//         >
//           Forgot password?
//         </a>
//       </div>

//       <button
//         type="button"
//         className="bg-accent text-bg-dark p-3 border-none rounded-md font-semibold cursor-pointer transition-all mt-4 hover:bg-[#3db9b0]"
//       >
//         Sign In
//       </button>

//       <div className="flex items-center my-6 text-secondary-text">
//         <div className="flex-grow h-px bg-white/10"></div>
//         <div className="px-4 text-sm">OR</div>
//         <div className="flex-grow h-px bg-white/10"></div>
//       </div>
//     </Fragment>
//   );
// };
