import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
})

export const getAllAssetConfig = () => api.get('/assetConfig')
export const getAllAssetStatus = () => api.get('/assetStatus')


const apis = {
    getAllAssetConfig,
    getAllAssetStatus,
}

export default apis