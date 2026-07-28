// Datos de división territorial de El Salvador (post-reforma 2023: 14 departamentos,
// 44 municipios, 262 distritos). Fuente: Asamblea Legislativa de El Salvador +
// Wikipedia (Anexo:Municipios y distritos de El Salvador), verificado por conteo
// (14/44/262 exacto). Los `code` son una numeracion jerarquica propia (no son
// codigos oficiales de DIGESTYC), solo para tener un identificador legible y estable.
export const elSalvadorGeo = [
  { code: '01', name: 'Ahuachapán', shortName: 'AHU', municipalities: [
    { code: '01-01', name: 'Ahuachapán Norte', districts: [
      { code: '01-01-01', name: 'Atiquizaya' }, { code: '01-01-02', name: 'El Refugio' }, { code: '01-01-03', name: 'San Lorenzo' }, { code: '01-01-04', name: 'Turín' },
    ] },
    { code: '01-02', name: 'Ahuachapán Centro', districts: [
      { code: '01-02-01', name: 'Ahuachapán' }, { code: '01-02-02', name: 'Apaneca' }, { code: '01-02-03', name: 'Concepción de Ataco' }, { code: '01-02-04', name: 'Tacuba' },
    ] },
    { code: '01-03', name: 'Ahuachapán Sur', districts: [
      { code: '01-03-01', name: 'Guaymango' }, { code: '01-03-02', name: 'Jujutla' }, { code: '01-03-03', name: 'San Francisco Menéndez' }, { code: '01-03-04', name: 'San Pedro Puxtla' },
    ] },
  ] },
  { code: '02', name: 'Cabañas', shortName: 'CAB', municipalities: [
    { code: '02-01', name: 'Cabañas Este', districts: [
      { code: '02-01-01', name: 'Guacotecti' }, { code: '02-01-02', name: 'San Isidro' }, { code: '02-01-03', name: 'Sensuntepeque' }, { code: '02-01-04', name: 'Victoria' }, { code: '02-01-05', name: 'Dolores' },
    ] },
    { code: '02-02', name: 'Cabañas Oeste', districts: [
      { code: '02-02-01', name: 'Cinquera' }, { code: '02-02-02', name: 'Ilobasco' }, { code: '02-02-03', name: 'Jutiapa' }, { code: '02-02-04', name: 'Tejutepeque' },
    ] },
  ] },
  { code: '03', name: 'Chalatenango', shortName: 'CHA', municipalities: [
    { code: '03-01', name: 'Chalatenango Norte', districts: [
      { code: '03-01-01', name: 'Citalá' }, { code: '03-01-02', name: 'La Palma' }, { code: '03-01-03', name: 'San Ignacio' },
    ] },
    { code: '03-02', name: 'Chalatenango Centro', districts: [
      { code: '03-02-01', name: 'Agua Caliente' }, { code: '03-02-02', name: 'Dulce Nombre de María' }, { code: '03-02-03', name: 'El Paraíso' }, { code: '03-02-04', name: 'La Reina' }, { code: '03-02-05', name: 'Nueva Concepción' }, { code: '03-02-06', name: 'San Fernando' }, { code: '03-02-07', name: 'San Francisco Morazán' }, { code: '03-02-08', name: 'San Rafael' }, { code: '03-02-09', name: 'Santa Rita' }, { code: '03-02-10', name: 'Tejutla' },
    ] },
    { code: '03-03', name: 'Chalatenango Sur', districts: [
      { code: '03-03-01', name: 'Arcatao' }, { code: '03-03-02', name: 'Azacualpa' }, { code: '03-03-03', name: 'Cancasque' }, { code: '03-03-04', name: 'Chalatenango' }, { code: '03-03-05', name: 'Comalapa' }, { code: '03-03-06', name: 'Concepción Quezaltepeque' }, { code: '03-03-07', name: 'El Carrizal' }, { code: '03-03-08', name: 'La Laguna' }, { code: '03-03-09', name: 'Las Vueltas' }, { code: '03-03-10', name: 'Las Flores' }, { code: '03-03-11', name: 'Nombre de Jesús' }, { code: '03-03-12', name: 'Nueva Trinidad' }, { code: '03-03-13', name: 'Ojos de Agua' }, { code: '03-03-14', name: 'Potonico' }, { code: '03-03-15', name: 'San Antonio de la Cruz' }, { code: '03-03-16', name: 'San Antonio Los Ranchos' }, { code: '03-03-17', name: 'San Francisco Lempa' }, { code: '03-03-18', name: 'San Isidro Labrador' }, { code: '03-03-19', name: 'San Luis del Carmen' }, { code: '03-03-20', name: 'San Miguel de Mercedes' },
    ] },
  ] },
  { code: '04', name: 'Cuscatlán', shortName: 'CUS', municipalities: [
    { code: '04-01', name: 'Cuscatlán Norte', districts: [
      { code: '04-01-01', name: 'Suchitoto' }, { code: '04-01-02', name: 'San José Guayabal' }, { code: '04-01-03', name: 'Oratorio de Concepción' }, { code: '04-01-04', name: 'San Bartolomé Perulapía' }, { code: '04-01-05', name: 'San Pedro Perulapán' },
    ] },
    { code: '04-02', name: 'Cuscatlán Sur', districts: [
      { code: '04-02-01', name: 'Cojutepeque' }, { code: '04-02-02', name: 'Candelaria' }, { code: '04-02-03', name: 'El Carmen' }, { code: '04-02-04', name: 'El Rosario' }, { code: '04-02-05', name: 'Monte San Juan' }, { code: '04-02-06', name: 'San Cristóbal' }, { code: '04-02-07', name: 'San Rafael Cedros' }, { code: '04-02-08', name: 'San Ramón' }, { code: '04-02-09', name: 'Santa Cruz Analquito' }, { code: '04-02-10', name: 'Santa Cruz Michapa' }, { code: '04-02-11', name: 'Tenancingo' },
    ] },
  ] },
  { code: '05', name: 'La Libertad', shortName: 'LIB', municipalities: [
    { code: '05-01', name: 'La Libertad Norte', districts: [
      { code: '05-01-01', name: 'Quezaltepeque' }, { code: '05-01-02', name: 'San Matías' }, { code: '05-01-03', name: 'San Pablo Tacachico' },
    ] },
    { code: '05-02', name: 'La Libertad Centro', districts: [
      { code: '05-02-01', name: 'San Juan Opico' }, { code: '05-02-02', name: 'Ciudad Arce' },
    ] },
    { code: '05-03', name: 'La Libertad Oeste', districts: [
      { code: '05-03-01', name: 'Colón' }, { code: '05-03-02', name: 'Jayaque' }, { code: '05-03-03', name: 'Sacacoyo' }, { code: '05-03-04', name: 'Tepecoyo' }, { code: '05-03-05', name: 'Talnique' },
    ] },
    { code: '05-04', name: 'La Libertad Este', districts: [
      { code: '05-04-01', name: 'Antiguo Cuscatlán' }, { code: '05-04-02', name: 'Huizúcar' }, { code: '05-04-03', name: 'Nuevo Cuscatlán' }, { code: '05-04-04', name: 'San José Villanueva' }, { code: '05-04-05', name: 'Zaragoza' },
    ] },
    { code: '05-05', name: 'La Libertad Costa', districts: [
      { code: '05-05-01', name: 'Chiltiupán' }, { code: '05-05-02', name: 'Jicalapa' }, { code: '05-05-03', name: 'La Libertad' }, { code: '05-05-04', name: 'Tamanique' }, { code: '05-05-05', name: 'Teotepeque' },
    ] },
    { code: '05-06', name: 'La Libertad Sur', districts: [
      { code: '05-06-01', name: 'Santa Tecla' }, { code: '05-06-02', name: 'Comasagua' },
    ] },
  ] },
  { code: '06', name: 'La Paz', shortName: 'PAZ', municipalities: [
    { code: '06-01', name: 'La Paz Oeste', districts: [
      { code: '06-01-01', name: 'Cuyultitán' }, { code: '06-01-02', name: 'Olocuilta' }, { code: '06-01-03', name: 'San Juan Talpa' }, { code: '06-01-04', name: 'San Luis Talpa' }, { code: '06-01-05', name: 'San Pedro Masahuat' }, { code: '06-01-06', name: 'Tapalhuaca' }, { code: '06-01-07', name: 'San Francisco Chinameca' },
    ] },
    { code: '06-02', name: 'La Paz Centro', districts: [
      { code: '06-02-01', name: 'El Rosario' }, { code: '06-02-02', name: 'Jerusalén' }, { code: '06-02-03', name: 'Mercedes La Ceiba' }, { code: '06-02-04', name: 'Paraíso de Osorio' }, { code: '06-02-05', name: 'San Antonio Masahuat' }, { code: '06-02-06', name: 'San Emigdio' }, { code: '06-02-07', name: 'San Juan Tepezontes' }, { code: '06-02-08', name: 'San Luis La Herradura' }, { code: '06-02-09', name: 'San Miguel Tepezontes' }, { code: '06-02-10', name: 'San Pedro Nonualco' }, { code: '06-02-11', name: 'Santa María Ostuma' }, { code: '06-02-12', name: 'Santiago Nonualco' },
    ] },
    { code: '06-03', name: 'La Paz Este', districts: [
      { code: '06-03-01', name: 'San Juan Nonualco' }, { code: '06-03-02', name: 'San Rafael Obrajuelo' }, { code: '06-03-03', name: 'Zacatecoluca' },
    ] },
  ] },
  { code: '07', name: 'La Unión', shortName: 'UNI', municipalities: [
    { code: '07-01', name: 'La Unión Norte', districts: [
      { code: '07-01-01', name: 'Anamorós' }, { code: '07-01-02', name: 'Bolívar' }, { code: '07-01-03', name: 'Concepción de Oriente' }, { code: '07-01-04', name: 'El Sauce' }, { code: '07-01-05', name: 'Lislique' }, { code: '07-01-06', name: 'Nueva Esparta' }, { code: '07-01-07', name: 'Pasaquina' }, { code: '07-01-08', name: 'Polorós' }, { code: '07-01-09', name: 'San José' }, { code: '07-01-10', name: 'Santa Rosa de Lima' },
    ] },
    { code: '07-02', name: 'La Unión Sur', districts: [
      { code: '07-02-01', name: 'Conchagua' }, { code: '07-02-02', name: 'El Carmen' }, { code: '07-02-03', name: 'Intipucá' }, { code: '07-02-04', name: 'La Unión' }, { code: '07-02-05', name: 'Meanguera del Golfo' }, { code: '07-02-06', name: 'San Alejo' }, { code: '07-02-07', name: 'Yayantique' }, { code: '07-02-08', name: 'Yucuaiquín' },
    ] },
  ] },
  { code: '08', name: 'Morazán', shortName: 'MOR', municipalities: [
    { code: '08-01', name: 'Morazán Norte', districts: [
      { code: '08-01-01', name: 'Arambala' }, { code: '08-01-02', name: 'Cacaopera' }, { code: '08-01-03', name: 'Corinto' }, { code: '08-01-04', name: 'El Rosario' }, { code: '08-01-05', name: 'Joateca' }, { code: '08-01-06', name: 'Jocoaitique' }, { code: '08-01-07', name: 'Meanguera' }, { code: '08-01-08', name: 'Perquín' }, { code: '08-01-09', name: 'San Fernando' }, { code: '08-01-10', name: 'San Isidro' }, { code: '08-01-11', name: 'Torola' },
    ] },
    { code: '08-02', name: 'Morazán Sur', districts: [
      { code: '08-02-01', name: 'Chilanga' }, { code: '08-02-02', name: 'Delicias de Concepción' }, { code: '08-02-03', name: 'El Divisadero' }, { code: '08-02-04', name: 'Gualococti' }, { code: '08-02-05', name: 'Guatajiagua' }, { code: '08-02-06', name: 'Jocoro' }, { code: '08-02-07', name: 'Lolotiquillo' }, { code: '08-02-08', name: 'Osicala' }, { code: '08-02-09', name: 'San Carlos' }, { code: '08-02-10', name: 'San Francisco Gotera' }, { code: '08-02-11', name: 'San Simón' }, { code: '08-02-12', name: 'Sensembra' }, { code: '08-02-13', name: 'Sociedad' }, { code: '08-02-14', name: 'Yamabal' }, { code: '08-02-15', name: 'Yoloaiquín' },
    ] },
  ] },
  { code: '09', name: 'San Miguel', shortName: 'SM', municipalities: [
    { code: '09-01', name: 'San Miguel Norte', districts: [
      { code: '09-01-01', name: 'Ciudad Barrios' }, { code: '09-01-02', name: 'Sesori' }, { code: '09-01-03', name: 'Nuevo Edén de San Juan' }, { code: '09-01-04', name: 'San Gerardo' }, { code: '09-01-05', name: 'San Luis de la Reina' }, { code: '09-01-06', name: 'Carolina' }, { code: '09-01-07', name: 'San Antonio' }, { code: '09-01-08', name: 'Chapeltique' },
    ] },
    { code: '09-02', name: 'San Miguel Centro', districts: [
      { code: '09-02-01', name: 'San Miguel' }, { code: '09-02-02', name: 'Comacarán' }, { code: '09-02-03', name: 'Uluazapa' }, { code: '09-02-04', name: 'Moncagua' }, { code: '09-02-05', name: 'Quelepa' }, { code: '09-02-06', name: 'Chirilagua' },
    ] },
    { code: '09-03', name: 'San Miguel Oeste', districts: [
      { code: '09-03-01', name: 'Chinameca' }, { code: '09-03-02', name: 'El Tránsito' }, { code: '09-03-03', name: 'Lolotique' }, { code: '09-03-04', name: 'Nueva Guadalupe' }, { code: '09-03-05', name: 'San Jorge' }, { code: '09-03-06', name: 'San Rafael Oriente' },
    ] },
  ] },
  { code: '10', name: 'San Salvador', shortName: 'SS', municipalities: [
    { code: '10-01', name: 'San Salvador Norte', districts: [
      { code: '10-01-01', name: 'Aguilares' }, { code: '10-01-02', name: 'El Paisnal' }, { code: '10-01-03', name: 'Guazapa' },
    ] },
    { code: '10-02', name: 'San Salvador Oeste', districts: [
      { code: '10-02-01', name: 'Apopa' }, { code: '10-02-02', name: 'Nejapa' },
    ] },
    { code: '10-03', name: 'San Salvador Este', districts: [
      { code: '10-03-01', name: 'Ilopango' }, { code: '10-03-02', name: 'San Martín' }, { code: '10-03-03', name: 'Soyapango' }, { code: '10-03-04', name: 'Tonacatepeque' },
    ] },
    { code: '10-04', name: 'San Salvador Centro', districts: [
      { code: '10-04-01', name: 'Ayutuxtepeque' }, { code: '10-04-02', name: 'Mejicanos' }, { code: '10-04-03', name: 'Cuscatancingo' }, { code: '10-04-04', name: 'Delgado' }, { code: '10-04-05', name: 'San Salvador' },
    ] },
    { code: '10-05', name: 'San Salvador Sur', districts: [
      { code: '10-05-01', name: 'San Marcos' }, { code: '10-05-02', name: 'Santo Tomás' }, { code: '10-05-03', name: 'Santiago Texacuangos' }, { code: '10-05-04', name: 'Panchimalco' }, { code: '10-05-05', name: 'Rosario de Mora' },
    ] },
  ] },
  { code: '11', name: 'San Vicente', shortName: 'SV', municipalities: [
    { code: '11-01', name: 'San Vicente Norte', districts: [
      { code: '11-01-01', name: 'Apastepeque' }, { code: '11-01-02', name: 'Santa Clara' }, { code: '11-01-03', name: 'San Ildefonso' }, { code: '11-01-04', name: 'San Esteban Catarina' }, { code: '11-01-05', name: 'San Sebastián' }, { code: '11-01-06', name: 'San Lorenzo' }, { code: '11-01-07', name: 'Santo Domingo' },
    ] },
    { code: '11-02', name: 'San Vicente Sur', districts: [
      { code: '11-02-01', name: 'San Vicente' }, { code: '11-02-02', name: 'Guadalupe' }, { code: '11-02-03', name: 'San Cayetano Istepeque' }, { code: '11-02-04', name: 'Tecoluca' }, { code: '11-02-05', name: 'Tepetitán' }, { code: '11-02-06', name: 'Verapaz' },
    ] },
  ] },
  { code: '12', name: 'Santa Ana', shortName: 'SA', municipalities: [
    { code: '12-01', name: 'Santa Ana Norte', districts: [
      { code: '12-01-01', name: 'Masahuat' }, { code: '12-01-02', name: 'Metapán' }, { code: '12-01-03', name: 'Santa Rosa Guachipilín' }, { code: '12-01-04', name: 'Texistepeque' },
    ] },
    { code: '12-02', name: 'Santa Ana Centro', districts: [
      { code: '12-02-01', name: 'Santa Ana' },
    ] },
    { code: '12-03', name: 'Santa Ana Este', districts: [
      { code: '12-03-01', name: 'Coatepeque' }, { code: '12-03-02', name: 'El Congo' },
    ] },
    { code: '12-04', name: 'Santa Ana Oeste', districts: [
      { code: '12-04-01', name: 'Candelaria de la Frontera' }, { code: '12-04-02', name: 'Chalchuapa' }, { code: '12-04-03', name: 'El Porvenir' }, { code: '12-04-04', name: 'San Antonio Pajonal' }, { code: '12-04-05', name: 'San Sebastián Salitrillo' }, { code: '12-04-06', name: 'Santiago de la Frontera' },
    ] },
  ] },
  { code: '13', name: 'Sonsonate', shortName: 'SON', municipalities: [
    { code: '13-01', name: 'Sonsonate Norte', districts: [
      { code: '13-01-01', name: 'Juayúa' }, { code: '13-01-02', name: 'Nahuizalco' }, { code: '13-01-03', name: 'Salcoatitán' }, { code: '13-01-04', name: 'Santa Catarina Masahuat' },
    ] },
    { code: '13-02', name: 'Sonsonate Centro', districts: [
      { code: '13-02-01', name: 'Sonsonate' }, { code: '13-02-02', name: 'Sonzacate' }, { code: '13-02-03', name: 'Nahulingo' }, { code: '13-02-04', name: 'San Antonio del Monte' }, { code: '13-02-05', name: 'Santo Domingo de Guzmán' },
    ] },
    { code: '13-03', name: 'Sonsonate Este', districts: [
      { code: '13-03-01', name: 'Armenia' }, { code: '13-03-02', name: 'Caluco' }, { code: '13-03-03', name: 'Cuisnahuat' }, { code: '13-03-04', name: 'Izalco' }, { code: '13-03-05', name: 'San Julián' }, { code: '13-03-06', name: 'Santa Isabel Ishuatán' },
    ] },
    { code: '13-04', name: 'Sonsonate Oeste', districts: [
      { code: '13-04-01', name: 'Acajutla' },
    ] },
  ] },
  { code: '14', name: 'Usulután', shortName: 'USU', municipalities: [
    { code: '14-01', name: 'Usulután Norte', districts: [
      { code: '14-01-01', name: 'Alegría' }, { code: '14-01-02', name: 'Berlín' }, { code: '14-01-03', name: 'El Triunfo' }, { code: '14-01-04', name: 'Estanzuelas' }, { code: '14-01-05', name: 'Jucuapa' }, { code: '14-01-06', name: 'Mercedes Umaña' }, { code: '14-01-07', name: 'Nueva Granada' }, { code: '14-01-08', name: 'San Buenaventura' }, { code: '14-01-09', name: 'Santiago de María' },
    ] },
    { code: '14-02', name: 'Usulután Este', districts: [
      { code: '14-02-01', name: 'California' }, { code: '14-02-02', name: 'Concepción Batres' }, { code: '14-02-03', name: 'Ereguayquín' }, { code: '14-02-04', name: 'Jucuarán' }, { code: '14-02-05', name: 'Ozatlán' }, { code: '14-02-06', name: 'Santa Elena' }, { code: '14-02-07', name: 'San Dionisio' }, { code: '14-02-08', name: 'Santa María' }, { code: '14-02-09', name: 'Tecapán' }, { code: '14-02-10', name: 'Usulután' },
    ] },
    { code: '14-03', name: 'Usulután Oeste', districts: [
      { code: '14-03-01', name: 'Jiquilisco' }, { code: '14-03-02', name: 'Puerto El Triunfo' }, { code: '14-03-03', name: 'San Agustín' }, { code: '14-03-04', name: 'San Francisco Javier' },
    ] },
  ] },
];
