import fs from 'fs';
import path from 'path';

// Venue data mapping ID to details
const venues = {
  // Osaka venues
  '21427172': { title: 'Basepoint Osaka', city: 'osaka', lat: 34.69374, lng: 135.50218, description: 'Coworking space in the heart of Osaka.' },
  '22372122': { title: 'Kansai Ruby Club', city: 'osaka', lat: 34.6937, lng: 135.5023, description: 'Regular meeting space for Ruby developers.' },
  '22577042': { title: 'Sakuragawa Station Area', city: 'osaka', lat: 34.66968, lng: 135.49169, description: 'Meeting point near Sakuragawa Station.' },
  '23994174': { title: 'Hozenji Yokocho', city: 'osaka', lat: 34.66746, lng: 135.50345, description: 'Traditional alley with restaurants and bars.' },
  '24213835': { title: 'Kenshu Center', city: 'osaka', lat: 34.70554, lng: 135.50173, description: 'Professional training and event center.' },
  '24529555': { title: 'Kantipur Curry House Sakaisujihonmachi', city: 'osaka', lat: 34.68298, lng: 135.49806, description: 'Nepalese restaurant with meeting space.' },
  '24870768': { title: 'Uniba Cafe', city: 'osaka', lat: 34.69421, lng: 135.50077, description: 'Cozy cafe with space for small gatherings.' },
  '24945450': { title: 'Torikizoku Juso', city: 'osaka', lat: 34.73162, lng: 135.48149, description: 'Yakitori restaurant chain location.' },
  '25085262': { title: 'Namaste Taj Mahal', city: 'osaka', lat: 34.68572, lng: 135.50032, description: 'Indian restaurant with event space.' },
  '25472037': { title: 'Kiyomizu-dera Temple', city: 'kyoto', lat: 34.99483, lng: 135.78505, description: 'Historic temple with scenic grounds.' },
  '25511520': { title: 'SYNTH', city: 'osaka', lat: 34.69873, lng: 135.50707, description: 'Co-working and event space.' },
  '25620385': { title: 'Tsuruha-no-yu', city: 'osaka', lat: 34.68641, lng: 135.50293, description: 'Traditional bathhouse and restaurant.' },
  '25630979': { title: 'Kintaro', city: 'osaka', lat: 34.68495, lng: 135.50095, description: 'Izakaya with private meeting rooms.' },
  '25928725': { title: 'WeWork Midosuji Frontier', city: 'osaka', lat: 34.68745, lng: 135.50043, description: 'Modern coworking space in business district.' },
  '26262059': { title: 'SYNTH ビジネスセンター', city: 'osaka', lat: 34.69873, lng: 135.50707, description: 'Business center with meeting facilities.' },
  '26378946': { title: 'Toranomon Cafe', city: 'osaka', lat: 34.69045, lng: 135.50235, description: 'Cafe with workspace facilities.' },
  '26459185': { title: 'Starbucks Namba Parks', city: 'osaka', lat: 34.66141, lng: 135.50366, description: 'Popular coffee shop with outdoor seating.' },
  '26539881': { title: 'StartHub Osaka', city: 'osaka', lat: 34.69251, lng: 135.50123, description: 'Startup incubator and event space.' },
  '26906060': { title: 'Online Venue', city: 'osaka', lat: 34.6937, lng: 135.5023, description: 'Virtual meeting space for online events.' },
  '26936190': { title: 'Nagai Park', city: 'osaka', lat: 34.61243, lng: 135.51862, description: 'Large public park with sports facilities.' },
  '27009944': { title: 'Kansai Innovation Center', city: 'osaka', lat: 34.69542, lng: 135.50087, description: 'Innovation hub for tech community.' },
  '27024215': { title: 'Rokko Mountain Trail Start', city: 'osaka', lat: 34.73889, lng: 135.26389, description: 'Starting point for Rokko mountain hikes.' },
  '27043438': { title: 'Kiyotaki River Trail', city: 'kyoto', lat: 35.04472, lng: 135.67639, description: 'Scenic riverside trail for outdoor activities.' },
  '27278002': { title: 'Mt. Shigi Trail', city: 'osaka', lat: 34.61306, lng: 135.66639, description: 'Mountain trail with temple views.' },
  '27310813': { title: 'Books & Coffee', city: 'osaka', lat: 34.69123, lng: 135.50321, description: 'Bookstore cafe with meeting space.' },
  '27370028': { title: 'The Dojo', city: 'osaka', lat: 34.68842, lng: 135.50154, description: 'Tech community hub and coworking space.' },
  '27370201': { title: 'Space Kante', city: 'osaka', lat: 34.69754, lng: 135.50432, description: 'Art space and event venue.' },
  '27382018': { title: 'GARB Weeks', city: 'osaka', lat: 34.69312, lng: 135.49687, description: 'Restaurant with riverside terrace.' },
  '27394125': { title: 'Kema Sakuranomiya Park', city: 'osaka', lat: 34.70111, lng: 135.52639, description: 'Cherry blossom viewing spot along the river.' },
  '27398802': { title: 'Nakanoshima Festival Tower', city: 'osaka', lat: 34.69306, lng: 135.50078, description: 'Modern tower with event spaces.' },
  '27423406': { title: 'International House Osaka', city: 'osaka', lat: 34.66987, lng: 135.50865, description: 'Conference center and cultural exchange facility.' },
  '27479006': { title: 'Ganko Namba', city: 'osaka', lat: 34.66545, lng: 135.50121, description: 'Traditional Japanese restaurant.' },
  '27513738': { title: 'Open Source Cafe', city: 'osaka', lat: 34.68765, lng: 135.50234, description: 'Developer-friendly cafe with fast WiFi.' },
  '27544400': { title: 'Ys Cafe', city: 'osaka', lat: 34.69087, lng: 135.50176, description: 'Modern cafe with presentation facilities.' },
  '27553394': { title: 'The Bricks', city: 'osaka', lat: 34.68423, lng: 135.49987, description: 'Creative space in renovated warehouse.' },
  '27563617': { title: 'Ishiyama-dera Temple', city: 'kyoto', lat: 34.96139, lng: 135.90556, description: 'Historic temple on Lake Biwa.' },
  '27573606': { title: 'Yahoo! JAPAN Osaka', city: 'osaka', lat: 34.70512, lng: 135.49687, description: 'Yahoo Japan office event space.' },
  '27584681': { title: 'Think Space', city: 'osaka', lat: 34.68921, lng: 135.50154, description: 'Quiet workspace for focused programming.' },
  '27585838': { title: 'Community Space KOKO', city: 'osaka', lat: 34.68756, lng: 135.50198, description: 'Community center for local events.' },
  '27606535': { title: 'Beer Stand Molto', city: 'osaka', lat: 34.68234, lng: 135.50456, description: 'Craft beer bar with outdoor seating.' },
  '27621042': { title: 'Kyoto International Conference Center', city: 'kyoto', lat: 35.05833, lng: 135.78194, description: 'Large conference facility near Takaragaike.' },
  '27705586': { title: 'Startup Cafe', city: 'osaka', lat: 34.69345, lng: 135.50223, description: 'Entrepreneur meetup venue.' },
  '27707749': { title: 'Kushikatsu Daruma', city: 'osaka', lat: 34.66523, lng: 135.50234, description: 'Famous kushikatsu restaurant.' },
  '27739757': { title: 'Shisha Cafe Oasis', city: 'osaka', lat: 34.66987, lng: 135.50345, description: 'Relaxed atmosphere with shisha and drinks.' },
  '27764496': { title: 'Arashiyama Bamboo Grove', city: 'kyoto', lat: 35.01694, lng: 135.67194, description: 'Famous bamboo forest path.' },
  '27868919': { title: 'Osaka Earthquake Memorial Park', city: 'osaka', lat: 34.69472, lng: 135.47806, description: 'Memorial park with educational facilities.' },
  '27929005': { title: 'Bills Osaka', city: 'osaka', lat: 34.69234, lng: 135.50087, description: 'Australian-style brunch restaurant.' },
  '27929713': { title: 'Craft Beer House molto', city: 'osaka', lat: 34.68432, lng: 135.50123, description: 'Craft beer bar with international selection.' },
  '27964003': { title: 'Osaka Castle Park Nishinomaru Garden', city: 'osaka', lat: 34.68472, lng: 135.52583, description: 'Garden with cherry blossoms near castle.' }
};

// Create venue directories and files
Object.entries(venues).forEach(([id, data]) => {
  const dir = path.join('content', 'venues', id);
  fs.mkdirSync(dir, { recursive: true });
  
  // Escape quotes in title for YAML
  const escapedTitle = data.title.replace(/'/g, "''");
  
  const content = `---
title: '${escapedTitle}'
city: '${data.city}'
coordinates:
  lat: ${data.lat}
  lng: ${data.lng}
---

${data.description}
`;

  fs.writeFileSync(path.join(dir, 'venue.md'), content);
});

console.log(`Created ${Object.keys(venues).length} venue files`);