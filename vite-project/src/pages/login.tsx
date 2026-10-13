import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Textbox from "../components/Textbox";
import { useSelector } from "react-redux";
import Button from "../components/Button";
import myImage from "../assets/login.png";
import { toast } from "sonner";
import { RootState } from "../redux/store";
import { useDispatch } from "react-redux"; // Importation de useDispatch
import { loginSuccess } from "../redux/slices/authSlice"; // Importation de l'action loginSuccess
import moment from "moment";
import ForgetMdp from "../components/task/ForgetMdp";
interface FormData {
  name?: string; // Optionnel en mode Login
  email: string;
  password: string;
  confirmPassword?: string; // Optionnel en mode Login
}

const Login = () => {
  const [openPassword, setOpenPassword] = useState(false); // Etat pour ouvrir/fermer le modal de recuperer mot de passe
  const [isLoginMode, setIsLoginMode] = useState(true); // État pour basculer entre Login et Sign-up
  const [showPassword, setShowPassword] = useState(false);

  const { user } = useSelector((state: RootState) => state.auth); //extraire l'utilisateur (user) du state global
  const dispatch = useDispatch(); // Utilisation de dispatch de Redux

  const {
    register,
    handleSubmit,
    reset,
    getValues, // Ajout pour récupérer la valeur des champs
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const navigate = useNavigate();
  //component did mount
  useEffect(() => {
    //Ca C'est après la récuperation du mot de passe on remplit les champs direct
    const savedEmail = localStorage.getItem("resetEmail");
    const savedPassword = localStorage.getItem("resetPassword");

    if (savedEmail && savedPassword && isLoginMode) {
      console.log("Email récupéré :", savedEmail);
      console.log("Mot de passe récupéré :", savedPassword);
      setValue("email", savedEmail);
      setValue("password", savedPassword);

      //  Supprimer après remplissage pour éviter qu'il reste
      localStorage.removeItem("resetEmail");
      localStorage.removeItem("resetPassword");
    }

    user && navigate("/dashboard");
  }, [user]);

  const submitHandler = async (data: FormData) => {
    const url = isLoginMode
      ? "http://localhost:5000/api/login"
      : "http://localhost:5000/api/signup";

    const requestData = isLoginMode
      ? { email: data.email, password: data.password }
      : { email: data.email, password: data.password, name: data.name };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (response.ok) {
        console.log(
          isLoginMode ? "Login successful" : "Signup successful",
          result.user
        );
        // Après la connexion réussie
        localStorage.setItem("loginTime", moment().format("HH:mm"));

        // Enregistrer l'utilisateur et le token dans le store Redux et localStorage
        dispatch(loginSuccess({ user: result.user, token: result.token }));

        if (isLoginMode) {
          // Rediriger l'utilisateur après connexion
          toast.success("✅ Connexion réussie !");
          navigate("/dashboard");
        } else {
          // Passer en mode login après inscription réussie
          setIsLoginMode(true);
          toast.success("✅ Inscription réussie !");
        }
      } else {
        console.error("Error:", result.message);
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error during API request:", error);
      alert("Failed to connect to the server (lancer le serveur backend)");
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row items-center justify-center bg-[#f3f4f6] p-4 bg">
      {/* Container principal */}
      <div className="w-full flex flex-col lg:flex-row items-center justify-center lg:gap-16 xl:gap-24">
        {/* Partie Gauche - Image */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center">
          <div className="cell">
            <div className="circle rotate-in-up-left"></div>
          </div>
          <img src={myImage} alt="task_app" className="hidden lg:block pb-16" />
        </div>

        {/* Partie Droite - Formulaire */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center">
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="form-container w-full max-w-sm flex flex-col gap-y-6 bg-white px-10 pt-14 pb-14 shadow-lg rounded-lg"
          >
            <div className="text-center">
              <p className="text-blue-600 font-bold text-2xl">
                {isLoginMode ? "Login" : "Sign Up"}
              </p>
              <p className="text-base text-gray-700">
                {isLoginMode
                  ? "Manage your tasks easily."
                  : "Create an account to get started!"}
              </p>
            </div>

            <div className="flex flex-col gap-y-5">
              {/* Nom (seulement en mode Sign-up) */}
              {!isLoginMode && (
                <Textbox
                  placeholder="Your Name"
                  type="text"
                  name="name"
                  label="Full Name"
                  className="w-full rounded-full"
                  register={register("name", {
                    required: "Name is required",
                  })}
                  error={errors.name?.message || ""}
                />
              )}

              {/* Email */}
              <Textbox
                placeholder="email@example.com"
                type="email"
                name="email"
                label="Email Address"
                className="w-full rounded-full"
                register={register("email", {
                  required: "Email is required",
                })}
                error={errors.email?.message || ""}
              />

              {/* Mot de passe */}
              <div className="relative w-full">
                <Textbox
                  placeholder="your password"
                  type={showPassword ? "text" : "password"} // Dynamique
                  name="password"
                  label="Password"
                  className="w-full rounded-full"
                  register={register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  error={errors.password?.message || ""}
                />
                {/* Bouton pour voir/cacher */}
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-600 bt-15"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? "👁️" : "🔒"}
                  {/* Icônes d'œil pour voir/cacher */}
                </button>
              </div>
              {/* Confirmation du mot de passe (seulement en mode Sign-up) */}
              {!isLoginMode && (
                <div className="relative w-full">
                  <Textbox
                    placeholder="Confirm your password"
                    type={showPassword ? "text" : "password"} // Dynamique
                    name="confirmPassword"
                    label="Confirm Password"
                    className="w-full rounded-full"
                    register={register("confirmPassword", {
                      required: "Password confirmation is required",
                      validate: (value) =>
                        value === getValues("password") ||
                        "Passwords do not match",
                    })}
                    error={errors.confirmPassword?.message || ""}
                  />

                  {/* Bouton pour voir/cacher le mot de passe */}
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-600 bt-15"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? "👁️" : "🔒"}
                  </button>
                </div>
              )}

              {/* Lien Mot de passe oublié (uniquement pour Login) */}
              {isLoginMode && (
                <span
                  className="text-sm text-gray-500 hover:text-blue-600 hover:underline cursor-pointer"
                  onClick={() => setOpenPassword(true)}
                >
                  Forgot Password?
                </span>
              )}

              {/* Bouton de soumission */}
              <Button
                type="submit"
                label={isLoginMode ? "Login" : "Sign Up"}
                className="w-full h-10 bg-blue-700 text-white rounded-full justify-center"
              />

              {/* Lien pour basculer entre Login et Sign-up */}
              <span
                className="text-sm text-gray-500 hover:text-blue-600 hover:underline cursor-pointer text-center"
                onClick={() => {
                  setIsLoginMode((prev) => !prev);
                  reset(); // Réinitialise le formulaire et les erreurs
                }}
              >
                {isLoginMode
                  ? "Create an account"
                  : "Already have an account? Log in"}
              </span>
            </div>
          </form>
        </div>
      </div>

      {/* Modal pour changer le mot de passe */}
      {openPassword && (
        <ForgetMdp open={openPassword} setOpen={setOpenPassword}></ForgetMdp>
      )}
    </div>
  );
};

export default Login;
