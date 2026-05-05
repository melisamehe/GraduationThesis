import { useEffect, useState } from "react";
import { BulbOutlined, BulbFilled } from "@ant-design/icons";

export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="flex items-center justify-center w-10 h-10 rounded-full
                 bg-black/5 dark:bg-white/10 text-slate-700 dark:text-yellow-400
                 hover:bg-black/10 dark:hover:bg-white/20 transition-all"
      title="Temayı Değiştir"
    >
      {isDark ? <BulbFilled className="text-xl" /> : <BulbOutlined className="text-xl" />}
    </button>
  );
};
