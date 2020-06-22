import axios from 'axios'

const api = axiso.create({
    baseURL: 'http://localhost:8000/api',
})

export const getAllAssetConfig = () => api.get('/assetConfig')

const apis = {
    getAllAssetConfig,
}

export default apis