// Говорим TS, что любой файл .php — это модуль, который экспортирует строку
declare module "*.php" {
  const content: string;
  export default content;
}

// Если планируете так же импортировать .txt или .html
declare module "*.txt" {
  const content: string;
  export default content;
}