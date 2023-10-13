import { ConfigProvider, theme } from "antd";
import { useThemeParams } from "@vkruglikov/react-telegram-web-app";
import { Footer } from "../components/Menu/Footer";

export const MainLayout = (props: any) => {
  const [colorScheme, themeParams] = useThemeParams();

  return (
    <div>
      <ConfigProvider
        theme={
          themeParams.text_color
            ? {
                algorithm:
                  colorScheme === "dark"
                    ? theme.darkAlgorithm
                    : theme.defaultAlgorithm,
                token: {
                  colorText: themeParams.text_color,
                  colorPrimary: themeParams.button_color,
                  colorBgBase: themeParams.bg_color,
                },
              }
            : undefined
        }
      >
        <div
          className="contentWrapper"
          style={{ paddingBottom: "50px", minHeight: "100vh" }}
        >
          {props.children}
        </div>
        <Footer />
      </ConfigProvider>
    </div>
  );
};
