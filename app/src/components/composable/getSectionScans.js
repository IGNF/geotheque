/**
 * Dictionnaire regroupant les différentes collections de scans
 * par grandes zones géographiques ou thématiques.
 *
 * @constant
 * @type {Object<string, string[]>}
 */
const SECTIONS = {
  'ALGERIE_TOPOGRAPHIQUE': 'AFRIQUE',
  'BENELUX': 'EUROPE',
  'MALI': 'AFRIQUE',
  'GRECE': 'EUROPE',
  'ITALIE': 'EUROPE',
  'AMERIQUE_SUD': 'AMERIQUES',
  'REPUBLIQUE_CENTRAFRICAINE': 'AFRIQUE',
  'AMERIQUE_CENTRALE': 'AMERIQUES',
  'SENEGAL': 'AFRIQUE',
  'ANTARCTIQUE': 'POLES',
  'MANUSCRITS': 'EUROPE',
  'AEF_AOF_TOPOGRAPHIQUE': 'AFRIQUE',
  'MAROC_TOPOGRAPHIQUE': 'AFRIQUE',
  'ALGERIE_THEMATIQUE': 'AFRIQUE',
  'BENIN': 'AFRIQUE',
  'CAMEROUN': 'AFRIQUE',
  'COMORES_MAURICE': 'AFRIQUE',
  'DJIBOUTI': 'AFRIQUE',
  'MADAGASCAR': 'AFRIQUE',
  'AFRIQUE_PAYS': 'AFRIQUE',
  'INDOCHINE_TOPOGRAPHIQUE': 'ASIE',
  'INDOCHINE': 'ASIE',
  'LEVANT': 'ASIE',
  'DOM_COM': 'MONDE',
  'HISTORIQUE': 'MONDE',
  'CADASTRE': 'METROPOLE',
  'CASSINI': 'METROPOLE',
  'EM_CARTES': 'METROPOLE',
  'EM_MINUTES': 'METROPOLE',
  'FR_2K_A_5K': 'METROPOLE',
  'FR_10K_A_50K': 'METROPOLE',
  'FR_100K_A_200K': 'METROPOLE',
  'FR_250K_A_600K': 'METROPOLE',
  'DEPARTEMENTS' : 'METROPOLE',
  'FR_THEMATIQUE_GEN': 'METROPOLE',
  'FR_THEMATIQUE_LOC': 'METROPOLE',
  'REGION_PARISIENNE': 'METROPOLE',
  'URBANISME': 'METROPOLE',
  'PLANS_DE_VILLE': 'METROPOLE',
  'TOPO_DIVERS': 'METROPOLE',
  'TOGO': 'AFRIQUE',
  'TCHAD': 'AFRIQUE',
}

/**
 * Détermine à quelle section appartient une collection de scans donnée.
 *
 * @param {string} collection - Nom de la collection à rechercher.
 * @returns {string} Nom de la section dans laquelle la collection est classée (ex : 'METROPOLE', 'AFRIQUE', etc.).
 *                   Retourne 'AUTRES' si la collection n'est pas trouvée dans les sections listées.
 */
export const findSectionScan = (collection) => {
  if (collection in SECTIONS) {
    console.log(SECTIONS[collection])
    return SECTIONS[collection]
  }
  console.error(`La collection "${collection}" n'existe pas dans les sections définies.`)
  return null;
}
