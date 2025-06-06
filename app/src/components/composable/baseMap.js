import PlanIGN from '@/assets/basecard/plan_ign.png'
import Ortho from '@/assets/basecard/ortho.jpeg'
import BDParcellaire from '@/assets/basecard/bdparcellaire.png'
import CartesIGN from '@/assets/basecard/cartesign.jpg'
import Scan25 from '@/assets/basecard/scan25.jpg'
import osm from '@/assets/basecard/scan25.jpg'
import ortho1950 from '@/assets/basecard/ortho1950.png'

export const layers_carto = [
  {
    id: 'plan',
    name: 'Plan IGN',
    thumbnail: PlanIGN,
  },
  {
    id: 'ortho',
    name: 'Ortho',
    thumbnail: Ortho,
  },
  {
    id: 'bdparcellaire',
    name: 'BDParcellaire',
    thumbnail: BDParcellaire,
  },
  {
    id: 'cartesign',
    name: 'Cartes IGN',
    thumbnail: CartesIGN,
  },
  {
    id: 'scan25',
    name: 'Scan25',
    thumbnail: Scan25,
  },
]

export const layers_carto_monde = [
  {
    id: 'osm',
    name: 'OSM',
    thumbnail: osm,
  },
  {
    id: 'ortho',
    name: 'Ortho',
    thumbnail: Ortho,
  },
  {
    id: 'cartesign',
    name: 'Cartes IGN',
    thumbnail: CartesIGN,
  },
  {
    id: 'scan25',
    name: 'Scan25',
    thumbnail: Scan25,
  },
]

export const layers_photo = [
  {
    id: 'plan',
    name: 'Plan IGN',
    thumbnail: PlanIGN,
  },
  {
    id: 'ortho',
    name: 'Ortho',
    thumbnail: Ortho,
  },
  {
    id: 'bdparcellaire',
    name: 'BDParcellaire',
    thumbnail: BDParcellaire,
  },
  {
    id: 'cartesign',
    name: 'Cartes IGN',
    thumbnail: CartesIGN,
  },
  {
    id: 'scan25',
    name: 'Scan25',
    thumbnail: Scan25,
  },
  {
    id: 'ortho1950',
    name: 'Ortho 1950',
    thumbnail: ortho1950,
  },
]

export const layers_photo_monde = [
  {
    id: 'osm',
    name: 'OSM',
    thumbnail: osm,
  },
  {
    id: 'ortho',
    name: 'Ortho',
    thumbnail: Ortho,
  },
  {
    id: 'cartesign',
    name: 'Cartes IGN',
    thumbnail: CartesIGN,
  },
  {
    id: 'scan25',
    name: 'Scan25',
    thumbnail: Scan25,
  },
]

/**************************** OTHERS LAYERS ************************** */

export const otherLayersCartoFrance = [
  {
    id: 'communes',
    name: 'Communes',
    thumbnail: ortho1950,
    visible: false,
  },
  {
    id: 'departements',
    name: 'Département',
    thumbnail: ortho1950,
    visible: false,
  },
]

export const otherLayersCartoMonde = [
  {
    id: 'feuilles_monde',
    name: 'Feuilles',
    thumbnail: ortho1950,
    visible: false,
  },
  {
    id: 'pays',
    name: 'Pays',
    thumbnail: ortho1950,
    visible: false,
  },
]

export const otherLayersPhotoFrance = [
  {
    id: 'communes',
    name: 'Communes',
    thumbnail: ortho1950,
    visible: false,
  },
  {
    id: 'departements',
    name: 'Département',
    thumbnail: ortho1950,
    visible: false,
  },
  {
    id: 'feuilles_france',
    name: 'Feuille',
    thumbnail: ortho1950,
    visible: false,
  },
  {
    id: 'france_zicad',
    name: 'Zicad',
    thumbnail: ortho1950,
    visible: false,
  },
]
