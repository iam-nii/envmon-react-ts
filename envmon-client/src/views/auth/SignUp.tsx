import {
  Link,
  Input,
  Button,
  Alert,
  Spinner,
  Select,
  SelectItem,
} from "@heroui/react";
import axiosClient from "../../axiosClient";
import { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { userRole } from "../../Types";
import { Eye, EyeClosed } from "lucide-react";

const SignUp = () => {
  const emailRef = useRef<HTMLInputElement | null>(null);
  const phoneRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const loginRef = useRef<HTMLInputElement | null>(null);
  const positionRef = useRef<HTMLInputElement | null>(null);
  const passwordConfirmationRef = useRef<HTMLInputElement | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean | null>(false);
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  // const { setToken, setUser } = useUserContext();
  const navigate = useNavigate();

  const handleSubmit = () => {
    setError(null);
    setIsLoading(true);
    console.log(selectedRole);
    // if (roleRef.current!.value === "Администратор") {
    //   roleRef.current!.value = "admin";
    // } else {
    //   roleRef.current!.value = "user";
    // }
    try {
      if (
        emailRef.current &&
        loginRef.current &&
        passwordRef.current &&
        selectedRole &&
        positionRef.current &&
        passwordConfirmationRef.current
      ) {
        if (
          passwordConfirmationRef.current.value != passwordRef.current.value
        ) {
          setError("Пароли не совпадают");
        }
        const payload = {
          user_id: uuidv4(),
          userName: loginRef.current.value,
          uEmail: emailRef.current.value,
          uPosition: positionRef.current.value,
          uRole: selectedRole,
          uPassword: passwordRef.current.value,
          uPassword_confirmation: passwordConfirmationRef.current.value,
        };
        console.log(payload);
        axiosClient
          .post("api/auth/signup/", payload)
          .then(({ data }) => {
            console.log(data);
            console.log(data.data);
            navigate("/signin");
          })
          .catch((err) => {
            const response = err.response;
            if (response && response.status === 422) {
              console.log(response.data.errors);
              setError(response.data.errors);
            }
          });
        // console.log(payload);
        setIsLoading(false);
      } else {
        console.log(emailRef.current);
        console.log(loginRef.current);
        console.log(passwordRef.current);
        console.log(selectedRole);
        console.log(positionRef.current);
        console.log(passwordConfirmationRef.current);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };
  const handleRoleChange = (value: string) => {
    // Update the state with the selected value
    setSelectedRole(value);
    console.log("Selected Role:", value); // Optional: Log the selected value
  };

  return (
    <div>
      {isLoading ? (
        <div className="flex w-full h-screen justify-center items-center bg-slate-50">
          <p className="text-2xl font-bold">Регистрация</p>
          <Spinner size="lg" color="success" />
        </div>
      ) : (
        <>
          {error && (
            <div>
              {typeof error === "object" && !Array.isArray(error) ? (
                Object.keys(error).map((key) => (
                  <Alert key={key} color="warning">
                    {error[key]}
                  </Alert>
                ))
              ) : (
                <Alert color="warning">{error}</Alert>
              )}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <h1 className="font-medium text-center mb-5 text-3xl">
              Регистрация
            </h1>
            <div className="mb-10">
              <Input
                isRequired
                errorMessage="Введите ФИО пожалуйста."
                label="ФИО"
                labelPlacement="outside"
                name="login"
                placeholder="Волков Андрей Ярославович"
                type="default"
                ref={loginRef}
              />
            </div>
            <div className="mb-10">
              <Input
                isRequired
                errorMessage="Введите действительный адрес электронной почты."
                label="Почта"
                labelPlacement="outside"
                name="email"
                placeholder="example@gmail.com"
                type="email"
                ref={emailRef}
              />
            </div>
            <div className="mb-10">
              <Input
                isRequired
                errorMessage="Введите действительный номер телефона."
                label="Телефон"
                labelPlacement="outside"
                name="phone"
                placeholder="+79999999999"
                type="phone"
                ref={phoneRef}
              />
            </div>
            <div className="mb-10">
              <Input
                isRequired
                errorMessage="Введите Должность пожалуйста."
                label="Должность"
                labelPlacement="outside"
                name="occupation"
                placeholder="occupation"
                type="default"
                ref={positionRef}
              />
            </div>
            <div className="mb-10">
              <Select
                label="Роль"
                labelPlacement="outside"
                placeholder="Выберите роль"
                onChange={(e) => handleRoleChange(e.target.value)}
              >
                {userRole.map((role) => (
                  <SelectItem key={role.key}>{role.label}</SelectItem>
                ))}
              </Select>
            </div>

            <div>
              <Input
                isRequired
                label="Пароль"
                labelPlacement="outside"
                name="password"
                placeholder="********"
                type={isVisible ? "text" : "password"}
                ref={passwordRef}
                className="mb-6"
                validate={(value) => {
                  if (value.length < 3) {
                    return "Пароль должен быть не менее 3 символов";
                  }
                }}
                endContent={
                  <button
                    aria-label="toggle password visibility"
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}
                  >
                    {isVisible ? (
                      <EyeClosed className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <Eye className="text-2xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
              />
            </div>
            <div>
              <Input
                isRequired
                label="Пароль"
                labelPlacement="outside"
                name="password_confirmation"
                placeholder="********"
                type={isVisible ? "text" : "password"}
                ref={passwordConfirmationRef}
                className="mb-6"
                validate={(value) => {
                  if (value.length < 3) {
                    return "Пароль должен быть не менее 3 символов";
                  }
                  if (value === passwordRef.current!.value) {
                    return "Пароли не совпадают";
                  }
                }}
                endContent={
                  <button
                    aria-label="toggle password visibility"
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}
                  >
                    {isVisible ? (
                      <EyeClosed className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <Eye className="text-2xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
              />
              <div className="w-full mt-6">
                <Button
                  color="success"
                  className="w-full"
                  onPress={handleSubmit}
                >
                  Зарегистрироваться
                </Button>
              </div>
            </div>
            <div className="mt-5">
              <h2 className="text-right text-gray-500">
                Нет аккаунта?{" "}
                <Link onPress={() => navigate("/signin")}>
                  <span className="text-blue-500 text-sm font-light mr-1">
                    {" "}
                    Войти
                  </span>
                </Link>
              </h2>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default SignUp;
