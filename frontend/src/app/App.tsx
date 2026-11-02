import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router'

import AppRouter from '@/app/router'
import { store } from '@/app/store'

const App = () => (
  <Provider store={store}>
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  </Provider>
)

export default App
