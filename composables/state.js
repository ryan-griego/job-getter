export const useGlobalState = () => {
  const state = useState('global', () => ({
    rowData: null
  }))

  return state
}
