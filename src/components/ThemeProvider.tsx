import React, { createContext, useContext, ReactNode } from "react";
import { ConfigProvider, ThemeConfig, theme } from "antd";
import { themeColors } from "../../tailwind.config";

// Theme context interface
interface ThemeContextType {
  theme: ThemeConfig;
  setTheme: (theme: ThemeConfig) => void;
}

// Create theme context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Default theme using NYU colors
const defaultTheme: ThemeConfig = {
  token: {
    colorPrimary: themeColors.primary,
    colorPrimaryHover: themeColors.purpleLight,
    colorSuccess: themeColors.success,
    colorWarning: themeColors.warning,
    colorError: themeColors.error,
    colorInfo: themeColors.info,
    borderRadius: 8,
    borderRadiusLG: 12,
  },
  components: {
    Button: {
      borderRadius: 8,
      controlHeight: 40,
    },
    Card: {
      borderRadius: 12,
    },
    Input: {
      borderRadius: 8,
    },
    Select: {
      borderRadius: 8,
    },
  },
};

// Theme provider props interface
interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: ThemeConfig;
}

// Custom hook to use theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Theme provider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialTheme = defaultTheme,
}) => {
  const [theme, setTheme] = React.useState<ThemeConfig>(initialTheme);

  const value: ThemeContextType = {
    theme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <ConfigProvider theme={theme}>{children}</ConfigProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
