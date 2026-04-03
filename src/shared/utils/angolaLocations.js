export const angolaLocations = {
  Luanda: ['Belas', 'Cacuaco', 'Cazenga', 'Kilamba Kiaxi', 'Talatona', 'Viana'],
  Benguela: ['Baia Farta', 'Benguela', 'Catumbela', 'Lobito'],
  Huambo: ['Caala', 'Huambo', 'Mungo']
};

export const getMunicipiosByProvincia = (provincia) => {
  return provincia ? angolaLocations[provincia] || [] : [];
};
