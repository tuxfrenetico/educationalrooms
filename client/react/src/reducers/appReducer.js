import { Languages } from '../helpers/appTexts'
import { LANGUAGE_CHANGED } from '../actions/actionTypes'

const initialState = {
  language: localStorage.getItem('LANGUAGE') || Languages.EN_US,
  user: JSON.parse(localStorage.getItem('USER'))
}

export const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case LANGUAGE_CHANGED:
      if (action.payload !== Languages.EN_US && action.payload !== Languages.PT_BR)
        return state
      localStorage.setItem('LANGUAGE', action.payload)
      return { language: action.payload }
    default:
      return state;
  }
}