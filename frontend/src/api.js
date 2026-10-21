import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export const erroMsg = (e) => e?.response?.data?.message || e?.message || 'Erro inesperado'

export const moeda = (v) => (v ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export const FAMILIAS = ['Amadeirado', 'Oriental', 'Floral', 'Gourmand', 'Cítrico', 'Aromático', 'Chipre', 'Fougère', 'Aquático', 'Frutal']

export default api
