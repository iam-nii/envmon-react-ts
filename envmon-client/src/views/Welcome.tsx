import { useNavigate } from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Image,
  useDisclosure,
  Button,
} from "@heroui/react";
import logo from "../../public/Icons/proto-2-light-short.svg";
import SunlightIcon from "../../public/Icons/SunlightIcon.svg";
import HumidityIcon from "../../public/Icons/humidityIcon.svg";
import microChipIcon from "../../public/Icons/microChipIcon.svg";
import TemperatureIcon from "../../public/Icons/TemperatureIcon.svg";
import threeDPrinting from "../../public/images/3d-printing-1.jpg";
import chartAlayze from "../../public/images/chart-alayze.png";
import WarhouseImage from "../../public/images/warehouse-image.jpg";
import TermsOfService from "../components/TermsOfService";

function Welcome() {
  const navigate = useNavigate();
  const date = new Date();
  const year = date.getFullYear();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Navbar isBordered className="bg-[#dfe9ed]">
        <NavbarBrand>
          <Link onPress={() => navigate("/")}>
            <img src={logo} alt="website logo" width={150} height={150} />
          </Link>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-80">
          <NavbarItem>
            <Link
              // href="/about"
              className="text-black font-semibold hover:text-slate-700 hover:text-lg transition-all duration-300"
              onPress={() => navigate("/about")}
            >
              О проекте
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Button
              color="primary"
              variant="shadow"
              className="p-5 text-lg"
              onPress={() => navigate("/signin")}
            >
              Войти
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <div className="flex flex-col items-center h-screen bg-[#f2f7f8]">
        <h1 className="text-4xl font-sans font-bold mb-4 text-center mt-20">
          Отслеживать. Анализировать. Оптимизировать.{" "}
        </h1>
        <p className="text-lg font-serif mb-10 text-center w-[60%] text-slate-700">
          Ваше здоровье важно, как и обеспечение качественных продуктов. Envmon
          разработан для того, чтобы помочь вам создать более здоровые и
          эффективные пространства.
        </p>
        {/* Animated Icons */}
        <div className="flex items-center justify-between space-between w-[40%]">
          <img
            src={SunlightIcon}
            alt="Sunlight Icon"
            className="w-10 h-10 fill-slate-500transform animate-float animation-delay-500"
          />
          <img
            src={HumidityIcon}
            alt="Humidity Icon"
            className="w-10 h-10 fill-slate-500 transform animate-float animation-delay-1000 z-10"
          />
          <img
            src={TemperatureIcon}
            alt="Temperature Icon"
            className="w-10 h-10 text-slate-500  transform animate-float animation-delay-1500 z-10"
          />
          <img
            src={microChipIcon}
            alt="Microchip Icon"
            className="w-10 h-10 fill-slate-500 transform animate-float animation-delay-2000 z-10"
          />
        </div>
        <div className="flex items-center justify-between space-between w-[70%] mt-10">
          <Image src={WarhouseImage} alt="Warehouse" height={200} width={300} />
          <Image
            src={threeDPrinting}
            alt="3D printing"
            height={300}
            width={400}
          />
          <Image
            src={chartAlayze}
            alt="Chart alayze"
            height={200}
            width={300}
          />
        </div>

        {/* <Button onClick={() => navigate("/signin")} /> */}
      </div>
      <footer className="bg-[#dfe9ed] py-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-slate-700">
                Envmon {year}. Все права защищены.
              </p>
              <p className="text-slate-700 mt-2">
                <Link href="/" className="hover:text-slate-900">
                  Политика конфиденциальности
                </Link>
                {" | "}
                <Link
                  onPress={onOpen}
                  className="hover:text-slate-900 cursor-pointer"
                >
                  Условия использования
                </Link>
                <TermsOfService isOpen={isOpen} onOpenChange={onOpenChange} />
              </p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-slate-700">Свяжитесь с нами:</p>
              <p className="text-slate-700 mt-2">
                Email:{" "}
                <a
                  href="mailto:info@envmon.com"
                  className="hover:text-slate-900"
                >
                  info@envmon.com
                </a>
              </p>
              <p className="text-slate-700">
                Телефон:{" "}
                <a href="tel:+7234567890" className="hover:text-slate-900">
                  +7 (234) 567-89-10
                </a>
              </p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-slate-700">Мы в соцсетях:</p>
              <div className="flex space-x-4 mt-2">
                <Link href="#" className="text-slate-700 hover:text-slate-900">
                  Facebook
                </Link>
                <Link href="#" className="text-slate-700 hover:text-slate-900">
                  Twitter
                </Link>
                <Link href="#" className="text-slate-700 hover:text-slate-900">
                  LinkedIn
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Welcome;
