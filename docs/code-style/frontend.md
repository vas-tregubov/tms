# Frontend Code Style

В документе зафиксированы основные правила написания frontend-кода проекта TMS.

## Технологии

Frontend проекта использует:

* React;
* TypeScript;
* Vite;
* Tailwind CSS;
* Feature-Sliced Design;
* Storybook;
* Vitest;
* Playwright;
* ESLint;
* Prettier.

## React-компоненты

Компоненты пишем в виде стрелочных функций.

```tsx
type ButtonProps = {
  children: React.ReactNode
  disabled?: boolean
}

const Button = ({ children, disabled = false }: ButtonProps) => {
  return (
    <button type="button" disabled={disabled}>
      {children}
    </button>
  )
}

export default Button
```

Для React-компонентов используем `export default`.

В одном файле должен находиться один основной React-компонент.

Название файла должно совпадать с названием компонента:

```text
Button.tsx
RouteCard.tsx
RoadsListPage.tsx
```

## Именование

React-компоненты, их файлы и TypeScript-типы называем в `PascalCase`:

```ts
Button
ButtonProps
RouteCard
RoadsListPage
```

Функции, переменные и свойства называем в `camelCase`:

```ts
createRoute
selectedDriver
isLoading
routeStatus
```

Константы, значение которых не изменяется и является общей константой приложения, называем в `UPPER_SNAKE_CASE`:

```ts
const DEFAULT_PAGE_SIZE = 20
const API_TIMEOUT = 5000
```

Булевы значения по возможности начинаем с `is`, `has`, `can` или `should`:

```ts
isLoading
isDisabled
hasError
canEdit
shouldRefresh
```

## Props

Тип пропсов называем по шаблону `<ComponentName>Props`:

```tsx
type ButtonProps = {
  children: React.ReactNode
  disabled?: boolean
  isLoading?: boolean
}
```

Компонент принимает необходимые данные и обработчики через props:

```tsx
type ButtonProps = {
  children: React.ReactNode
  onClick?: () => void
}

const Button = ({ children, onClick }: ButtonProps) => {
  return (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  )
}

export default Button
```

Redux и другие глобальные хранилища не заменяют props.

Через props передаём локальные данные компонента и обработчики. Глобальное состояние используем только для данных, которые действительно нужны нескольким независимым частям приложения.

## Импорты и алиасы

Для импортов из `src` используем алиас `@`.

```tsx
import Button from '@/shared/ui/Button'
import RouteCard from '@/entities/route/ui/RouteCard'
```

Не используем длинные относительные пути:

```tsx
// Не рекомендуется
import Button from '../../../../shared/ui/Button'
```

Короткие относительные импорты разрешены внутри одного модуля:

```tsx
import Button from './Button'
import type { ButtonProps } from './types'
```

## Feature-Sliced Design

Frontend использует следующие слои:

```text
src/
├── app/
├── pages/
├── widgets/
├── features/
├── entities/
└── shared/
```

Назначение слоёв:

* `app` — запуск и глобальная конфигурация приложения;
* `pages` — страницы приложения;
* `widgets` — крупные самостоятельные блоки страниц;
* `features` — пользовательские действия и сценарии;
* `entities` — бизнес-сущности;
* `shared` — переиспользуемые компоненты, функции, API-клиенты и ресурсы.

Зависимости направлены сверху вниз:

```text
app → pages → widgets → features → entities → shared
```

Нижний слой не должен импортировать верхний.

Например:

```text
features может импортировать entities и shared
entities может импортировать shared
shared не импортирует остальные слои
```

Слайсы одного слоя не должны напрямую зависеть друг от друга.

Для внешнего использования слайс предоставляет публичный API через `index.ts`.

Пример:

```text
shared/ui/Button/
├── Button.tsx
├── Button.stories.tsx
├── Button.test.tsx
└── index.ts
```

```ts
// shared/ui/Button/index.ts
export { default } from './Button'
```

Использование:

```tsx
import Button from '@/shared/ui/Button'
```

Не импортируем внутренние файлы слайса в обход его публичного API.

## Стили

Компоненты стилизуем преимущественно с помощью классов Tailwind CSS.

```tsx
const Button = ({ children }: ButtonProps) => {
  return (
    <button className="rounded-control bg-primary px-4 py-2 text-white hover:bg-primary-hover">
      {children}
    </button>
  )
}
```

Глобальные стили и подключение Tailwind находятся в:

```text
src/app/styles/index.css
```

Общие дизайн-токены проекта находятся в:

```text
src/app/styles/theme.css
```

В дизайн-токенах храним:

* фирменные цвета;
* цвета текста и фона;
* шрифты;
* радиусы;
* тени;
* другие общие визуальные значения.

Пример:

```css
@theme {
  --color-primary: #2563eb;
  --color-primary-hover: #1d4ed8;
  --color-danger: #dc2626;
  --color-danger-hover: #b91c1c;

  --font-sans: Inter, sans-serif;

  --radius-control: 0.5rem;
  --radius-card: 0.75rem;
}
```

После определения токенов используем соответствующие Tailwind-классы:

```tsx
<button className="rounded-control bg-primary hover:bg-primary-hover">
  Создать маршрут
</button>
```

Не дублируем фирменные цвета произвольными значениями в разных компонентах:

```tsx
// Не рекомендуется
<button className="bg-[#2563eb]">Создать маршрут</button>
```

Произвольные значения допустимы только для редких локальных случаев, которые не являются частью общей дизайн-системы.

## Storybook

Для переиспользуемых UI-компонентов создаём Storybook stories.

```text
Button.tsx
Button.stories.tsx
```

Stories создаём для значимых состояний компонента:

* Default;
* Disabled;
* Loading.

Если компонент имеет визуальные варианты, добавляем отдельные stories:

* Primary;
* Secondary;
* Danger.

`Danger` используется для действий с потенциально разрушительными последствиями, например удаления маршрута.

Story не должна дублировать реализацию компонента. Она только передаёт компоненту определённые props и показывает результат.

## Тесты

Vitest используем для проверки логики компонентов и функций.

Тестируем значимое поведение:

* обработку пользовательских действий;
* отображение состояния загрузки;
* блокировку недоступных действий;
* условное отображение данных;
* преобразование данных.

Не требуется тестировать каждый Tailwind-класс или очевидную статическую разметку.

Playwright используем для важных пользовательских сценариев, проходящих через несколько компонентов или страниц.

## Автоматическое форматирование

ESLint проверяет качество и корректность кода.

Prettier отвечает за единообразное форматирование.

Перед коммитом Husky и lint-staged автоматически проверяют изменённые файлы.

Не форматируем код вручную пробелами и переносами, если это может сделать Prettier.
