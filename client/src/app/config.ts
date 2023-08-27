import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "./store"
import baseStyled, { ThemedStyledInterface } from "styled-components"
import { Theme } from "@backend/types/client/theme"

export const styled = baseStyled as ThemedStyledInterface<Theme>
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
