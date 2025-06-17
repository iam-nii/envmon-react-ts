import { Button, Input } from "@heroui/react";
import { useEffect, useState } from "react";
import axiosClient from "../../axiosClient";

function SystemSettings() {
  const [warningTime, setWarningTime] = useState<number>(0);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [smtpHost, setSmtpHost] = useState<string>("");
  const [smtpPort, setSmtpPort] = useState<string>("");
  const [smtpAuth, setSmtpAuth] = useState<string>("true");
  const [isAltered, setIsAltered] = useState<boolean>(false);
  useEffect(() => {
    axiosClient
      .get("/api/reports/?method=GET&query=getSettings")
      .then(({ data }) => {
        console.log("data", data.data.warning_settings);
        const interval = Number(data.data.warning_settings.interval);
        const email = data.data.message_settings.account_email;
        const password = data.data.message_settings.account_password;

        const smtpHost = data.data.message_settings.smtp_host;
        const smtpPort = data.data.message_settings.smtp_port;
        const smtpAuth = data.data.message_settings.smtp_auth;
        setWarningTime(interval);
        setEmail(email);
        setPassword(password);
        setSmtpHost(smtpHost);
        setSmtpPort(smtpPort);
        setSmtpAuth(smtpAuth);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, []);
  const handleSave = () => {
    const data = {
      warning_settings: {
        interval: warningTime,
      },
      message_settings: {
        account_email: email,
        account_password: password,
        smtp_host: smtpHost,
        smtp_port: smtpPort,
        smtp_auth: smtpAuth,
      },
    };
    console.log("data", data);
    axiosClient
      .get(
        "/api/reports/?method=POST&query=setSettings&data=" +
          JSON.stringify(data)
      )
      .then(({ data }) => {
        console.log("data", data);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Настройки предупреждений</h1>
      <Input
        label="Время предупреждения, с"
        className="w-80"
        type="number"
        value={warningTime.toString()}
        onChange={(e) =>
          setWarningTime(() => {
            setIsAltered(true);
            return Number(e.target.value);
          })
        }
      />
      <h1 className="text-2xl font-bold">Настройки почты</h1>
      <Input
        label="Email для отправки предупреждений"
        className="w-80"
        type="email"
        value={email}
        onChange={(e) => {
          setIsAltered(true);
          setEmail(e.target.value);
        }}
      />
      <Input
        label="Пароль для отправки предупреждений"
        className="w-80"
        type="password"
        value={password}
        onChange={(e) => {
          setIsAltered(true);
          setPassword(e.target.value);
        }}
      />
      <Input
        label="SMTP-хост"
        className="w-80"
        value={smtpHost}
        onChange={(e) => {
          setIsAltered(true);
          setSmtpHost(e.target.value);
        }}
      />
      <Input
        label="SMTP-порт"
        className="w-80"
        value={smtpPort}
        onChange={(e) => {
          setIsAltered(true);
          setSmtpPort(e.target.value);
        }}
      />
      <Input
        label="SMTP-auth"
        className="w-80"
        value={smtpAuth}
        isDisabled={true}
        onChange={(e) => {
          setIsAltered(true);
          setSmtpAuth(e.target.value);
        }}
      />

      <Button
        isDisabled={!isAltered}
        onPress={handleSave}
        color="primary"
        className="w-[100px]"
      >
        Сохранить
      </Button>
    </div>
  );
}

export default SystemSettings;
