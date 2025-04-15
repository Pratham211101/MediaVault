import { SignUp } from '@clerk/nextjs'
import { dark } from '@clerk/themes';

export default function Page() {
  return(
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-purple-900 to-black">
    <SignUp 
      appearance={{
        baseTheme: dark, // <-- this enables Clerk's built-in dark theme
        elements: {
          card: 'bg-black/80 border border-purple-700 shadow-xl rounded-xl backdrop-blur-sm',
          headerTitle: 'text-purple-400 text-3xl font-bold',
          headerSubtitle: 'text-gray-400',
          formFieldInput:
            'bg-black text-purple-300 border border-purple-700 focus:ring-2 focus:ring-purple-500',
          formButtonPrimary:
            'bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md transition-all',
          footerActionText: 'text-gray-400',
          footerActionLink: 'text-purple-400 hover:text-purple-300',
        },
      }}
    />
    </div>
  ) 
}