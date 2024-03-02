// ?format=json;i=1;locale=en_CA;q1=bikes;sp_cs=UTF-8;x1=primaryCategoryCode
import { useLoaderData } from '@remix-run/react'
import { utilsLoader } from './actions'
import { Button } from '~/components'

export let loader = utilsLoader

export const ModelPageHD = () => {
    const { modelData } = useLoaderData()
    const Click = () => {

        var selectedModelName = ''
        if (modelData.model.includes('Nightster')) {
            selectedModelName = 'nightster.html'
        }
        else if (modelData.model.includes('Sportster')) {
            selectedModelName = 'sportster-s.html'
        }
        else if (modelData.model.includes('Nightster')) {
            selectedModelName = 'onightster-special.html'
        }
        else if (modelData.model.includes('Softail Standard')) {
            selectedModelName = 'softail-standard.html'
        }
        else if (modelData.model.includes('Street Bob')) {
            selectedModelName = 'street-bob.html'
        }
        else if (modelData.model.includes('Fat Boy')) {
            selectedModelName = 'fat-boy.html'
        }
        else if (modelData.model.includes('Fat Bob')) {
            selectedModelName = 'fat-bob.html'
        }
        else if (modelData.model.includes('Breakout')) {
            selectedModelName = 'breakout.html'
        }
        else if (modelData.model.includes('Low Rider ST')) {
            selectedModelName = 'low-rider-st.html'
        }
        else if (modelData.model.includes('Low Rider S')) {
            selectedModelName = 'low-rider-s.html'
        }
        else if (modelData.model.includes('Heritag Classic')) {
            selectedModelName = 'heritage-classic.html'
        }
        else if (modelData.model.includes('Road Glide Limited')) {
            selectedModelName = 'road-glide-limited.html'
        }
        else if (modelData.model.includes('Road Glide Special')) {
            selectedModelName = 'road-glide-special.html'
        }
        else if (modelData.model.includes('CVO Street Glide')) {
            selectedModelName = 'cvo-street-glide.html'
        }
        else if (modelData.model.includes('CVO Road Glide Limited')) {
            selectedModelName = 'cvo-road-glide-limited.html'
        }
        else if (modelData.model.includes('Road King Special')) {
            selectedModelName = 'road-king-special.html'
        }
        else if (modelData.model.includes('Road Glide ST')) {
            selectedModelName = 'road-glide-limited.html'
        }
        else if (modelData.model.includes('CVO Road Glide')) {
            selectedModelName = 'cvo-road-glide.html'
        }
        else if (modelData.model.includes('Road Glide')) {
            selectedModelName = 'road-glide.html'
        }
        else if (modelData.model.includes('Electra Glide')) {
            selectedModelName = 'electra-glide.html'
        }
        else if (modelData.model.includes('Street Glide')) {
            selectedModelName = 'street-glide.html'
        }
        else if (modelData.model.includes('Street Glide ST')) {
            selectedModelName = 'street-glide-st.html'
        }
        else if (modelData.model.includes('Heritag Classic')) {
            selectedModelName = 'heritage-classic.html'
        }
        else if (modelData.model.includes('Ultra Limited')) {
            selectedModelName = 'ultra-limited.html'
        }
        else if (modelData.model.includes('Street Glide Special')) {
            selectedModelName = 'street-glide-special.html'
        }

        else {
            selectedModelName = ''
        }
        var baseUrl =
            'https://www.harley-davidson.com/ca/en/motorcycles/'
        var modelUrl = baseUrl + selectedModelName
        window.open(modelUrl, '_blank')
    }
    return (
        <Button variant='outline' onClick={Click} type="submit" content="update">
            Model Page
        </Button>
    )
}
