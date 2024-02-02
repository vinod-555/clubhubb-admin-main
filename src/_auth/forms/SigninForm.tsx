import  { z } from "zod";
 import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
 import {
    Form,
    FormControl,
     FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
  import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { SigninValidationSchema} from "@/lib/validation"
import Loader from "@/components/shared/Loader";
import { useSigninClubMutation } from "@/store/api/authApi";
import { Link, useNavigate} from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { useUserContext } from "@/context/useUserContext";
 

const SigninForm = () => {
  
  const { toast } = useToast();
  const navigate = useNavigate();
   const[signinclub,{data,isLoading,error,isSuccess}]=useSigninClubMutation();
   const { setIsAuthenticated, checkAuthClub} = useUserContext(); // Get context functions

  console.log(data)
 
  
  const form = useForm<z.infer<typeof SigninValidationSchema>>({
      resolver: zodResolver(SigninValidationSchema ),
      defaultValues: {
        clubEmail:"",
        password:""
      },
    })
    // 2. Define a submit handler.
    async function handleSignin(values: z.infer<typeof SigninValidationSchema>) {
        const session= await signinclub({...values});
        console.log(session)
        if (!session) {
          toast({ title: "Login failed. Please try again." });
          
          return;
        }
         
    }
    if(error){
      console.log(error);
    }
     
     useEffect(()=>{
      if(isSuccess){
        const { clubId, token: authToken } = data;
         console.log(clubId)
        localStorage.setItem('token', authToken);
        setIsAuthenticated(true);

        // Perform additional actions after successful login
        checkAuthClub();
        navigate("/");

      }

     },[isSuccess,data,navigate,setIsAuthenticated,checkAuthClub])


  return (
    <Form {...form}>
    <div className="sm:w-420 flex-center flex-col" >
{/*        <img src="/public/assets/images/logo.svg" width={300}  alt="ClubHubb" />*/}
<h1 className="font-bold text-2xl md:text-4xl">Clubhubb</h1>
        
    <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
      Login Club
    </h2>
    <p className="text-light-3 small-medium md:base-regular mt-2">
      To use Clubhubb, Please enter your details
    </p>

    <form
      onSubmit={form.handleSubmit(handleSignin)}
      className="flex flex-col gap-5 w-full mt-4">
       
 
      <FormField
        control={form.control}
        name="clubEmail"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="shad-form_label">Email</FormLabel>
            <FormControl>
              <Input type="text" className="shad-input" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="shad-form_label">Password</FormLabel>
            <FormControl>
              <Input type="password" className="shad-input" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <Button type="submit" className="shad-button_primary">
          {isLoading ?(
            <div className="flex-center gap-2">
                <Loader/> Loading...
             </div>
          ):"Sign up"}
      </Button>
      <p className="text-small-regular text-light-2 text-center mt-2">
          
           <Link
             to="/forgot-password"
             className="text-primary-500 text-small-semibold ml-1">
             Forgot pasword ?
           </Link>
          
         </p>
         
      

   
   
    </form>

</div>
</Form>
  )
}

export default SigninForm;
