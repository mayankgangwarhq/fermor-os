export interface DistrictInfo {
  name: string;
  lat: number;
  lon: number;
  popularLocations?: string[];
}

export interface StateInfo {
  state: string;
  districts: DistrictInfo[];
}

export const INDIA_STATES_DATA: StateInfo[] = [
  {
    state: 'Rajasthan',
    districts: [
      { name: 'Jaipur', lat: 26.9124, lon: 75.7873, popularLocations: ['Jagatpura (VGU)', 'Sanganer APMC', 'Chomu Mandi', 'Bassi Farm Hub', 'Mansarovar', 'Amer Agro Center'] },
      { name: 'Jodhpur', lat: 26.2389, lon: 73.0243, popularLocations: ['Mandore Mandi', 'Boronada Agri Zone', 'Bilara Farm Area', 'Piparcity'] },
      { name: 'Kota', lat: 25.2138, lon: 75.8648, popularLocations: ['Bhamashah Mandi', 'Ramganj Mandi', 'Sangod', 'Itawa'] },
      { name: 'Bikaner', lat: 28.0229, lon: 73.3119, popularLocations: ['Nokha Mandi', 'Khajuwala', 'Lunkaransar', 'Dungargarh'] },
      { name: 'Ajmer', lat: 26.4499, lon: 74.6399, popularLocations: ['Kishangarh Mandi', 'Beawar APMC', 'Pushkar Valley', 'Nasirabad'] },
      { name: 'Udaipur', lat: 24.5854, lon: 73.7125, popularLocations: ['Fatehnagar APMC', 'Mavli Farm Hub', 'Vallabhnagar', 'Salumber'] },
      { name: 'Alwar', lat: 27.5530, lon: 76.6346, popularLocations: ['Kherli Mandi', 'Khairthal APMC', 'Tijara Farm Zone', 'Behror'] },
      { name: 'Bhilwara', lat: 25.3216, lon: 74.6307, popularLocations: ['Gulabpura Mandi', 'Mandalgarh', 'Shahpura', 'Asind'] },
      { name: 'Bharatpur', lat: 27.2152, lon: 77.5030, popularLocations: ['Kumher APMC', 'Deeg Mandi', 'Bayana', 'Nadbai'] },
      { name: 'Sikar', lat: 27.6094, lon: 75.1399, popularLocations: ['Neem Ka Thana', 'Fatehpur Shekhawati', 'Ringas Mandi', 'Danta Ramgarh'] },
      { name: 'Sri Ganganagar', lat: 29.9038, lon: 73.8772, popularLocations: ['Padampur APMC', 'Suratgarh Mandi', 'Sadulshahar', 'Gajsinghpur'] },
      { name: 'Hanumangarh', lat: 29.5818, lon: 74.3294, popularLocations: ['Nohar Mandi', 'Bhadra APMC', 'Pilibanga', 'Rawatsar'] },
      { name: 'Nagaur', lat: 27.2070, lon: 73.7423, popularLocations: ['Merta City APMC', 'Degana', 'Kuchaman Mandi', 'Didwana'] },
      { name: 'Pali', lat: 25.7711, lon: 73.3234, popularLocations: ['Sumerpur APMC', 'Sojat City Mandi', 'Falna', 'Bali'] },
      { name: 'Tonk', lat: 26.1664, lon: 75.7885, popularLocations: ['Malpura APMC', 'Niwai Mandi', 'Deoli APMC', 'Uniara'] },
      { name: 'Churu', lat: 28.2900, lon: 74.9600, popularLocations: ['Sujangarh Mandi', 'Ratangarh', 'Sadulpur', 'Sardarshahar'] },
      { name: 'Barmer', lat: 25.7532, lon: 71.3967, popularLocations: ['Balotra Mandi', 'Baytu', 'Siwana', 'Gudamalani'] },
      { name: 'Jaisalmer', lat: 26.9157, lon: 70.9083, popularLocations: ['Pokhran APMC', 'Mohangarh Canal Hub', 'Fatehgarh', 'Ramgarh'] },
      { name: 'Chittorgarh', lat: 24.8887, lon: 74.6269, popularLocations: ['Nimbahera APMC', 'Kapasan Mandi', 'Begun', 'Rawatbhata'] },
      { name: 'Sawai Madhopur', lat: 25.9928, lon: 76.3526, popularLocations: ['Gangapur City APMC', 'Bamanwas', 'Bonli', 'Chauth Ka Barwara'] },
      { name: 'Jhalawar', lat: 24.5973, lon: 76.1610, popularLocations: ['Bhawani Mandi APMC', 'Jhalrapatan', 'Pirawa', 'Khanpur'] },
      { name: 'Jhunjhunu', lat: 28.1289, lon: 75.3995, popularLocations: ['Nawalgarh Mandi', 'Chirawa APMC', 'Surajgarh', 'Khetri'] },
      { name: 'Bundi', lat: 25.4415, lon: 75.6441, popularLocations: ['Keshoraipatan APMC', 'Nainwa', 'Hindoli', 'Talera'] },
      { name: 'Dausa', lat: 26.8924, lon: 76.3377, popularLocations: ['Bandikui APMC', 'Lalsot Mandi', 'Mahwa', 'Sikrai'] },
      { name: 'Dholpur', lat: 26.7025, lon: 77.8934, popularLocations: ['Bari Mandi', 'Rajakhera APMC', 'Baseri', 'Saipau'] },
      { name: 'Karauli', lat: 26.4983, lon: 77.0273, popularLocations: ['Hindaun City APMC', 'Todabhim', 'Sapotra', 'Mandrail'] },
      { name: 'Baran', lat: 25.1011, lon: 76.5132, popularLocations: ['Chhabra APMC', 'Atru Mandi', 'KishanGanj', 'Mangrol'] },
      { name: 'Pratapgarh', lat: 24.0321, lon: 74.7811, popularLocations: ['Chhoti Sadri APMC', 'Dhariawad', 'Arnod', 'Pipalkhunt'] },
      { name: 'Rajsamand', lat: 25.0715, lon: 73.8814, popularLocations: ['Nathdwara APMC', 'Amet Mandi', 'Kumbhalgarh', 'Deogarh'] },
      { name: 'Sirohi', lat: 24.8826, lon: 72.8589, popularLocations: ['Abu Road APMC', 'Sheoganj Mandi', 'Pindwara', 'Reodar'] },
      { name: 'Jalore', lat: 25.3444, lon: 72.6157, popularLocations: ['Bhinmal APMC', 'Sanchore Mandi', 'Ahore', 'Bagoda'] },
      { name: 'Dungarpur', lat: 23.8431, lon: 73.7147, popularLocations: ['Sagwara APMC', 'Aspur', 'Chikhli', 'Simalwara'] },
      { name: 'Banswara', lat: 23.5461, lon: 74.4349, popularLocations: ['Garhi APMC', 'Kushalgarh Mandi', 'Bagidora', 'Ghatol'] }
    ]
  },
  {
    state: 'Uttar Pradesh',
    districts: [
      { name: 'Lucknow', lat: 26.8467, lon: 80.9462, popularLocations: ['Dubagga Mandi', 'Bakshi Ka Talab APMC', 'Mohanlalganj Farm Hub', 'Malihabad Mango Zone', 'Gosainganj', 'Kakori'] },
      { name: 'Kanpur', lat: 26.4499, lon: 80.3319, popularLocations: ['Chakeri Agri Hub', 'Kalyanpur Farm Center', 'Bilhaur APMC', 'Ghatampur'] },
      { name: 'Varanasi', lat: 25.3176, lon: 82.9739, popularLocations: ['Chandpur APMC', 'Rohania Agri Zone', 'Pindra Farm Hub', 'Sewapuri'] },
      { name: 'Agra', lat: 27.1767, lon: 78.0081, popularLocations: ['Fatehabad APMC', 'Achhnera Potato Mandi', 'Khandauli Farm Area', 'Shamsabad'] },
      { name: 'Prayagraj', lat: 25.4358, lon: 81.8463, popularLocations: ['Mundera APMC', 'Phulpur Farm Zone', 'Naini Agri Hub', 'Karchhana'] },
      { name: 'Meerut', lat: 28.9845, lon: 77.7064, popularLocations: ['Mawana Sugarcane Belt', 'Sardhana APMC', 'Hastinapur', 'Daurala'] },
      { name: 'Bareilly', lat: 28.3670, lon: 79.4304, popularLocations: ['Delapeer Mandi', 'Faridpur APMC', 'Baheri Sugar Belt', 'Aonla'] },
      { name: 'Aligarh', lat: 27.8974, lon: 78.0880, popularLocations: ['Dhaniapur APMC', 'Khair Mandi', 'Atrauli', 'Iglas'] },
      { name: 'Moradabad', lat: 28.8386, lon: 78.7733, popularLocations: ['Kanth Mandi', 'Bilari APMC', 'Thakurdwara', 'Kundarki'] },
      { name: 'Saharanpur', lat: 29.9679, lon: 77.5452, popularLocations: ['Deoband APMC', 'Nakur Mandi', 'Behat Horticulture Zone', 'Gangoh'] },
      { name: 'Gorakhpur', lat: 26.7606, lon: 83.3732, popularLocations: ['Sahjanwa APMC', 'Chauri Chaura Mandi', 'Campierganj', 'Bansgaon'] },
      { name: 'Noida (Gautam Buddha Nagar)', lat: 28.5355, lon: 77.3910, popularLocations: ['Dadri APMC', 'Jewar Farm Hub', 'Dankaur', 'Greater Noida Agro Hub'] },
      { name: 'Mathura', lat: 27.4924, lon: 77.6737, popularLocations: ['Kosi Kalan APMC', 'Chhata Mandi', 'Govardhan', 'Raya'] },
      { name: 'Muzaffarnagar', lat: 29.4727, lon: 77.7085, popularLocations: ['Khatoli Sugarcane APMC', 'Budhana Mandi', 'Shahpur', 'Jansath'] },
      { name: 'Jhansi', lat: 25.4484, lon: 78.5685, popularLocations: ['Mauranipur APMC', 'Babina Farm Zone', 'Moth Mandi', 'Garautha'] },
      { name: 'Ayodhya', lat: 26.7922, lon: 82.1998, popularLocations: ['Sohawal APMC', 'Rudauli Mandi', 'Bikapur', 'Milkipur'] },
      { name: 'Barabanki', lat: 26.9269, lon: 81.1834, popularLocations: ['Safdarganj APMC', 'Ramnagar Mandi', 'Haidergarh', 'Fatehpur'] },
      { name: 'Hardoi', lat: 27.3956, lon: 80.1314, popularLocations: ['Sandila APMC', 'Shahabad Mandi', 'Bilgram', 'Madhoganj'] },
      { name: 'Sitapur', lat: 27.5685, lon: 80.6829, popularLocations: ['Mahmoodabad APMC', 'Biswan Mandi', 'Sidhauli', 'Laharpur'] },
      { name: 'Unnao', lat: 26.5454, lon: 80.4878, popularLocations: ['Purwa Mandi', 'Safipur APMC', 'Bangarmau', 'Hasanganj'] }
    ]
  },
  {
    state: 'Madhya Pradesh',
    districts: [
      { name: 'Indore', lat: 22.7196, lon: 75.8577, popularLocations: ['Choithram APMC', 'Laxmibai Nagar Mandi', 'Mhow Agri Center', 'Sanwer Farm Hub', 'Depalpur', 'Rau Farm Area'] },
      { name: 'Bhopal', lat: 23.2599, lon: 77.4126, popularLocations: ['Karond APMC', 'Berasia Mandi', 'Kolar Agri Hub', 'Phanda'] },
      { name: 'Ujjain', lat: 23.1765, lon: 75.7885, popularLocations: ['Chimanganj APMC', 'Mahidpur Mandi', 'Nagda', 'Tarana', 'Khachrod'] },
      { name: 'Gwalior', lat: 26.2183, lon: 78.1828, popularLocations: ['Lashkar APMC', 'Dabra Mandi', 'Bhitarwar', 'Morar'] },
      { name: 'Jabalpur', lat: 23.1815, lon: 79.9864, popularLocations: ['Krishi Upaj Mandi Vijaynagar', 'Patan APMC', 'Sihora Mandi', 'Shahpura'] },
      { name: 'Dewas', lat: 22.9676, lon: 76.0534, popularLocations: ['Dewas APMC', 'Sonkatch Mandi', 'Bagli', 'Hatpipliya'] },
      { name: 'Dhar', lat: 22.5978, lon: 75.2979, popularLocations: ['Dhar APMC', 'Badnawar Mandi', 'Manawar', 'Kukshi'] },
      { name: 'Khargone', lat: 21.8234, lon: 75.6146, popularLocations: ['Khargone APMC', 'Sanawad Mandi', 'Barwaha Cotton Hub', 'Kasrawad', 'Bhikangaon'] },
      { name: 'Khandwa', lat: 21.8314, lon: 76.3498, popularLocations: ['Khandwa APMC', 'Pandhana Mandi', 'Harsud', 'Punasa'] },
      { name: 'Ratlam', lat: 23.3315, lon: 75.0367, popularLocations: ['Ratlam APMC', 'Jaora Mandi', 'Alot', 'Sailana'] },
      { name: 'Mandsaur', lat: 24.0722, lon: 75.0682, popularLocations: ['Mandsaur APMC (Garlic Hub)', 'Piplia Mandi', 'Sitamau', 'Malhargarh'] },
      { name: 'Neemuch', lat: 24.4764, lon: 74.8719, popularLocations: ['Neemuch APMC (Medicinal Herbs)', 'Manasa Mandi', 'Jawad'] },
      { name: 'Sagar', lat: 23.8388, lon: 78.7378, popularLocations: ['Sagar APMC', 'Bina Mandi', 'Khurai', 'Rehli', 'Deori'] },
      { name: 'Vidisha', lat: 23.5251, lon: 77.8081, popularLocations: ['Vidisha APMC (Sharbati Wheat)', 'Basoda Mandi', 'Kurwai', 'Sironj'] },
      { name: 'Hoshangabad (Narmadapuram)', lat: 22.7519, lon: 77.7289, popularLocations: ['Itarsi APMC', 'Pipariya Mandi', 'Seoni Malwa', 'Babai'] },
      { name: 'Sehore', lat: 23.2031, lon: 77.0844, popularLocations: ['Sehore APMC', 'Ashta Mandi', 'Ichhawar', 'Nasrullaganj'] },
      { name: 'Chhindwara', lat: 22.0574, lon: 78.9382, popularLocations: ['Chhindwara APMC (Corn City)', 'Pandhurna Mandi', 'Sausar', 'Amarwara'] }
    ]
  },
  {
    state: 'Punjab',
    districts: [
      { name: 'Ludhiana', lat: 30.9010, lon: 75.8573, popularLocations: ['PAU Agro Hub', 'Khanna APMC (Asia Largest Grain Mandi)', 'Jagraon Mandi', 'Samrala', 'Doraha'] },
      { name: 'Amritsar', lat: 31.6340, lon: 74.8723, popularLocations: ['Bhagtanwala APMC', 'Rayya Mandi', 'Ajnala', 'Majitha'] },
      { name: 'Jalandhar', lat: 31.3260, lon: 75.5762, popularLocations: ['Maqsudan APMC', 'Nakodar Mandi', 'Phillaur', 'Shahkot'] },
      { name: 'Patiala', lat: 30.3398, lon: 76.3869, popularLocations: ['Patiala APMC', 'Nabha Mandi', 'Rajpura APMC', 'Samana'] },
      { name: 'Bathinda', lat: 30.2110, lon: 74.9455, popularLocations: ['Bathinda APMC', 'Rampura Phul Mandi', 'Maur Mandi', 'Talwandi Sabo'] },
      { name: 'Hoshiarpur', lat: 31.5273, lon: 75.9149, popularLocations: ['Hoshiarpur APMC', 'Dasuya Mandi', 'Mukerian', 'Garhshankar'] },
      { name: 'Sangrur', lat: 30.2458, lon: 75.8421, popularLocations: ['Sunam Mandi', 'Dhuri APMC', 'Malerkotla', 'Ahmedgarh'] },
      { name: 'Firozpur', lat: 30.9237, lon: 74.6114, popularLocations: ['Firozpur Cantt APMC', 'Zira Mandi', 'Guru Har Sahai'] },
      { name: 'Fazilka', lat: 30.4036, lon: 74.0254, popularLocations: ['Abohar APMC (Kinnow Hub)', 'Fazilka Mandi', 'Jalalabad'] },
      { name: 'Gurdaspur', lat: 32.0419, lon: 75.4053, popularLocations: ['Batala APMC', 'Gurdaspur Mandi', 'Dera Baba Nanak', 'Dhariwal'] },
      { name: 'Moga', lat: 30.8165, lon: 75.1717, popularLocations: ['Moga APMC', 'Baghapurana Mandi', 'Nihal Singh Wala'] }
    ]
  },
  {
    state: 'Haryana',
    districts: [
      { name: 'Karnal', lat: 29.6857, lon: 76.9905, popularLocations: ['Karnal APMC (Basmati Rice Hub)', 'Taraori Mandi', 'Gharaunda Center of Excellence', 'Indri', 'Nilokheri'] },
      { name: 'Gurugram', lat: 28.4595, lon: 77.0266, popularLocations: ['Sohna APMC', 'Pataudi Mandi', 'Farrukhnagar', 'Badshahpur'] },
      { name: 'Faridabad', lat: 28.4089, lon: 77.3178, popularLocations: ['Ballabgarh APMC', 'Old Faridabad Mandi', 'Mohna'] },
      { name: 'Panipat', lat: 29.3909, lon: 76.9635, popularLocations: ['Panipat APMC', 'Samalkha Mandi', 'Israna', 'Madlauda'] },
      { name: 'Hisar', lat: 29.1492, lon: 75.7217, popularLocations: ['Hisar APMC', 'Hansi Mandi', 'Barwala', 'Uklana'] },
      { name: 'Ambala', lat: 30.3782, lon: 76.7767, popularLocations: ['Ambala City APMC', 'Ambala Cantt Mandi', 'Barara', 'Mullana'] },
      { name: 'Rohtak', lat: 28.8955, lon: 76.6066, popularLocations: ['Rohtak APMC', 'Meham Mandi', 'Sampla', 'Kalanaur'] },
      { name: 'Sonipat', lat: 28.9931, lon: 77.0151, popularLocations: ['Sonipat APMC', 'Gohana Mandi', 'Ganaur Agro Hub', 'Kharkhoda'] },
      { name: 'Sirsa', lat: 29.5349, lon: 75.0298, popularLocations: ['Sirsa APMC (Cotton Hub)', 'Dabwali Mandi', 'Ellenabad', 'Rania'] },
      { name: 'Kurukshetra', lat: 29.9695, lon: 76.8783, popularLocations: ['Thanesar APMC', 'Shahbad Mandi', 'Pehowa', 'Ladwa'] },
      { name: 'Bhiwani', lat: 28.7831, lon: 76.1397, popularLocations: ['Bhiwani APMC', 'Tosham Mandi', 'Siwani', 'Loharu'] }
    ]
  },
  {
    state: 'Maharashtra',
    districts: [
      { name: 'Pune', lat: 18.5204, lon: 73.8567, popularLocations: ['Gultekdi Market Yard APMC', 'Manchar Mandi', 'Baramati Agro Hub', 'Junnar Tomato Zone', 'Khed', 'Shirur'] },
      { name: 'Nashik', lat: 19.9975, lon: 73.7898, popularLocations: ['Lasalgaon APMC (Asia Largest Onion Mandi)', 'Pimpalgaon Baswant', 'Dindori Grape Belt', 'Niphad', 'Yeola'] },
      { name: 'Nagpur', lat: 21.1458, lon: 79.0882, popularLocations: ['Kalamna APMC (Orange Market)', 'Katol Mandi', 'Saoner', 'Umred', 'Narkhed'] },
      { name: 'Mumbai', lat: 19.0760, lon: 72.8777, popularLocations: ['Vashi APMC (Navi Mumbai)', 'Dadar Flower Market', 'Kalyan Agri Hub'] },
      { name: 'Chhatrapati Sambhajinagar (Aurangabad)', lat: 19.8762, lon: 75.3433, popularLocations: ['Jadhavwadi APMC', 'Paithan Mandi', 'Vaijapur', 'Gangapur'] },
      { name: 'Solapur', lat: 17.6599, lon: 75.9064, popularLocations: ['Solapur APMC', 'Pandharpur Mandi', 'Barshi', 'Akkalkot', 'Karmala'] },
      { name: 'Kolhapur', lat: 16.7050, lon: 74.2433, popularLocations: ['Shahupuri Jaggery APMC', 'Gadhinglaj Mandi', 'Shirol', 'Hatkanangle'] },
      { name: 'Ahmednagar', lat: 19.0948, lon: 74.7480, popularLocations: ['Rahata APMC (Pomegranate Hub)', 'Shrirampur Mandi', 'Sangamner', 'Kopargaon'] },
      { name: 'Jalgaon', lat: 21.0077, lon: 75.5626, popularLocations: ['Jalgaon APMC (Banana City)', 'Raver Mandi', 'Bhusawal', 'Chopda'] },
      { name: 'Amravati', lat: 20.9374, lon: 77.7796, popularLocations: ['Amravati APMC', 'Achalpur Mandi', 'Warud Citrus Hub', 'Morshi'] },
      { name: 'Satara', lat: 17.6805, lon: 73.9936, popularLocations: ['Satara APMC', 'Karad Mandi', 'Phaltan', 'Wai Strawberry Zone'] },
      { name: 'Sangli', lat: 16.8524, lon: 74.5815, popularLocations: ['Sangli Turmeric APMC', 'Tasgaon Grape Mandi', 'Miraj', 'Islampur'] }
    ]
  },
  {
    state: 'Gujarat',
    districts: [
      { name: 'Ahmedabad', lat: 23.0225, lon: 72.5714, popularLocations: ['Jamalpur APMC', 'Sanand Mandi', 'Dholka', 'Viramgam', 'Bavla Rice Hub'] },
      { name: 'Surat', lat: 21.1702, lon: 72.8311, popularLocations: ['Sardar Market APMC', 'Bardoli Mandi', 'Mandvi', 'Mahuva Sugarcane Zone'] },
      { name: 'Rajkot', lat: 22.3039, lon: 70.8022, popularLocations: ['Bedi Yard APMC', 'Gondal APMC (Groundnut/Chilli Hub)', 'Jasdan Mandi', 'Dhoraji'] },
      { name: 'Vadodara', lat: 22.3072, lon: 73.1812, popularLocations: ['Sayajipura APMC', 'Padra Mandi', 'Karjan Cotton Hub', 'Dabhoi'] },
      { name: 'Anand', lat: 22.5645, lon: 72.9289, popularLocations: ['Anand APMC', 'Petlad Mandi', 'Khambhat', 'Borsad'] },
      { name: 'Bhavnagar', lat: 21.7645, lon: 72.1519, popularLocations: ['Chitra APMC', 'Mahuva Onion Mandi', 'Talaja', 'Gadhada'] },
      { name: 'Jamnagar', lat: 22.4707, lon: 70.0577, popularLocations: ['Hapa APMC', 'Dhrol Mandi', 'Kalavad', 'Lalpur'] },
      { name: 'Junagadh', lat: 21.5222, lon: 70.4579, popularLocations: ['Junagadh APMC (Kesar Mango Hub)', 'Visavadar Mandi', 'Keshod', 'Mangrol'] },
      { name: 'Mehsana', lat: 23.5880, lon: 72.3693, popularLocations: ['Unjha APMC (Asia Largest Spice Mandi)', 'Kadi Mandi', 'Visnagar', 'Vijapur'] },
      { name: 'Banaskantha', lat: 24.1724, lon: 72.4346, popularLocations: ['Deesa APMC (Potato Hub)', 'Palanpur Mandi', 'Tharad', 'Dhanera'] }
    ]
  },
  {
    state: 'Karnataka',
    districts: [
      { name: 'Bengaluru (Bangalore)', lat: 12.9716, lon: 77.5946, popularLocations: ['Yeshwanthpur APMC', 'Singena Agrahara Fruit Mandi', 'Doddaballapur', 'Hoskote'] },
      { name: 'Mysuru (Mysore)', lat: 12.2958, lon: 76.6394, popularLocations: ['Bandipalya APMC', 'Nanjangud Mandi', 'Hunsur', 'T. Narasipura'] },
      { name: 'Hubballi-Dharwad', lat: 15.3647, lon: 75.1240, popularLocations: ['Amargol APMC (Chilli Hub)', 'Dharwad Mandi', 'Kundgol', 'Navalgund'] },
      { name: 'Belagavi (Belgaum)', lat: 15.8497, lon: 74.4977, popularLocations: ['Belagavi APMC', 'Bailhongal Mandi', 'Gokak', 'Chikkodi'] },
      { name: 'Kolar', lat: 13.1367, lon: 78.1291, popularLocations: ['Kolar APMC (Asia 2nd Largest Tomato Market)', 'Mulbagal Mandi', 'Bangarapet', 'Malur'] },
      { name: 'Shivamogga (Shimoga)', lat: 13.9299, lon: 75.5681, popularLocations: ['Shivamogga Arecanut APMC', 'Bhadravati Mandi', 'Sagar', 'Shikaripura'] },
      { name: 'Davanagere', lat: 14.4644, lon: 75.9218, popularLocations: ['Davanagere APMC', 'Harihar Mandi', 'Honnali', 'Jagalur'] },
      { name: 'Ballari (Bellary)', lat: 15.1394, lon: 76.9214, popularLocations: ['Ballari APMC', 'Hospet Mandi', 'Siruguppa Rice Hub', 'Sandur'] },
      { name: 'Vijayapura (Bijapur)', lat: 16.8302, lon: 75.7100, popularLocations: ['Vijayapura APMC', 'Indi Mandi', 'Sindagi', 'Basavana Bagewadi'] },
      { name: 'Tumakuru (Tumkur)', lat: 13.3379, lon: 77.1010, popularLocations: ['APMC Yard Batawadi', 'Tiptur Coconut APMC', 'Kunigal', 'Madhugiri'] }
    ]
  },
  {
    state: 'Tamil Nadu',
    districts: [
      { name: 'Chennai', lat: 13.0827, lon: 80.2707, popularLocations: ['Koyambedu Wholesale Market Complex', 'Madhavaram Agro Hub', 'Tambaram'] },
      { name: 'Coimbatore', lat: 11.0168, lon: 76.9558, popularLocations: ['MGR Market APMC', 'Pollachi Coconut Hub', 'Mettupalayam Vegetable Mandi', 'Sulur'] },
      { name: 'Madurai', lat: 9.9252, lon: 78.1198, popularLocations: ['Mattuthavani Central Market', 'Paravai APMC', 'Usilampatti', 'Melur'] },
      { name: 'Tiruchirappalli (Trichy)', lat: 10.7905, lon: 78.7047, popularLocations: ['Gandhi Market Trichy', 'Manachanallur Rice Hub', 'Thuraiyur', 'Lalgudi'] },
      { name: 'Salem', lat: 11.6643, lon: 78.1460, popularLocations: ['Shevapet APMC', 'Attur Sago Mandi', 'Mecheri', 'Omalur'] },
      { name: 'Erode', lat: 11.3410, lon: 77.7172, popularLocations: ['Semmampalayam Turmeric APMC', 'Perundurai Mandi', 'Bhavani', 'Gobichettipalayam'] },
      { name: 'Thanjavur', lat: 10.7870, lon: 79.1378, popularLocations: ['Thanjavur Rice Bowl Hub', 'Kumbakonam Mandi', 'Papanasam', 'Pattukkottai'] },
      { name: 'Tirunelveli', lat: 8.7139, lon: 77.7567, popularLocations: ['Nainarkulam APMC', 'Ambasamudram Mandi', 'Tenkasi Agro Zone', 'Radhapuram'] },
      { name: 'Dindigul', lat: 10.3673, lon: 77.9803, popularLocations: ['Dindigul Onion Mandi', 'Oddanchatram Vegetable Market', 'Palani', 'Nilakottai'] }
    ]
  },
  {
    state: 'Telangana',
    districts: [
      { name: 'Hyderabad', lat: 17.3850, lon: 78.4867, popularLocations: ['Bowenpally Agricultural Market', 'Gaddi Annaram Fruit Mandi', 'Malakpet Market', 'Shamshabad'] },
      { name: 'Warangal', lat: 17.9689, lon: 79.5941, popularLocations: ['Enumamula APMC (Asia 2nd Largest Grain/Chilli Market)', 'Narsampet Mandi', 'Jangaon', 'Parkal'] },
      { name: 'Nizamabad', lat: 18.6725, lon: 78.0941, popularLocations: ['Nizamabad APMC (Major Turmeric Hub)', 'Bodhan Mandi', 'Armoor', 'Banswada'] },
      { name: 'Karimnagar', lat: 18.4386, lon: 79.1288, popularLocations: ['Karimnagar APMC', 'Jagtial Mango Hub', 'Huzurabad Mandi', 'Peddapalli'] },
      { name: 'Khammam', lat: 17.2473, lon: 80.1514, popularLocations: ['Khammam Chilli APMC', 'Madhira Mandi', 'Sathupally', 'Kothagudem'] },
      { name: 'Nalgonda', lat: 17.0575, lon: 79.2684, popularLocations: ['Nalgonda APMC', 'Miryalaguda Rice Hub', 'Suryapet Mandi', 'Devarakonda'] },
      { name: 'Mahbubnagar', lat: 16.7488, lon: 77.9856, popularLocations: ['Badepally APMC', 'Jadcherla Mandi', 'Nagarkurnool', 'Wanaparthy'] }
    ]
  },
  {
    state: 'Andhra Pradesh',
    districts: [
      { name: 'Guntur', lat: 16.3067, lon: 80.4365, popularLocations: ['Guntur Mirchi Yard (Asia Largest Chilli Market)', 'Tenali Mandi', 'Narasaraopet', 'Sattenapalle'] },
      { name: 'Vijayawada (NTR District)', lat: 16.5062, lon: 80.6480, popularLocations: ['Gollapudi Wholesale APMC', 'Nuzvid Mango Hub', 'Jaggayyapeta', 'Tiruvuru'] },
      { name: 'Kurnool', lat: 15.8281, lon: 78.0373, popularLocations: ['Kurnool Onion Mandi', 'Adoni Cotton Market', 'Nandyal', 'Yemmiganur'] },
      { name: 'Visakhapatnam', lat: 17.6868, lon: 83.2185, popularLocations: ['Anakapalle Jaggery APMC', 'Gajuwaka Market', 'Bheemunipatnam', 'Narsipatnam'] },
      { name: 'Tirupati (Chittoor)', lat: 13.6288, lon: 79.4192, popularLocations: ['Tirupati APMC', 'Madanapalle Tomato Hub', 'Chittoor Jaggery Market', 'Pileru'] },
      { name: 'West Godavari (Eluru)', lat: 16.7107, lon: 81.0952, popularLocations: ['Eluru APMC', 'Tadepalligudem Onion/Banana Hub', 'Bhimavaram Aqua Zone', 'Tanuku'] },
      { name: 'East Godavari (Kakinada/Rajahmundry)', lat: 16.9891, lon: 82.2475, popularLocations: ['Kakinada APMC', 'Rajahmundry Flower Mandi', 'Mandapeta Rice Hub', 'Ravulapalem'] }
    ]
  },
  {
    state: 'Bihar',
    districts: [
      { name: 'Patna', lat: 25.5941, lon: 85.1376, popularLocations: ['Bazar Samiti Bazar Mandi', 'Danapur APMC', 'Fatuha Agri Zone', 'Mokama Pulses Hub', 'Barh'] },
      { name: 'Muzaffarpur', lat: 26.1209, lon: 85.3647, popularLocations: ['Muzaffarpur Litchi Hub', 'Kanti Mandi', 'Motipur', 'Saraiya'] },
      { name: 'Bhagalpur', lat: 25.2425, lon: 86.9842, popularLocations: ['Bhagalpur Silk/Jardalu Mango Hub', 'Kahalgaon', 'Naugachia Banana Zone', 'Bihpur'] },
      { name: 'Gaya', lat: 24.7914, lon: 85.0002, popularLocations: ['Gaya Bazar Samiti', 'Tekari Mandi', 'Sherghati', 'Bodhgaya Agro Hub'] },
      { name: 'Purnia', lat: 25.7771, lon: 87.4753, popularLocations: ['Gulabbagh APMC (Major Maize/Jute Hub)', 'Banmankhi Mandi', 'Kasba', 'Dhamdaha'] },
      { name: 'Begusarai', lat: 25.4182, lon: 86.1272, popularLocations: ['Begusarai Mandi', 'Bakhri', 'Teghra Maize Hub', 'Barauni'] },
      { name: 'Darbhanga', lat: 26.1542, lon: 85.8918, popularLocations: ['Darbhanga Makhana Hub', 'Benipur Mandi', 'Baheri', 'Hayaghat'] },
      { name: 'Samastipur', lat: 25.8629, lon: 85.7811, popularLocations: ['Pusa RAU Campus Hub', 'Rosera Mandi', 'Dalsinghsarai', 'Tajpur'] }
    ]
  },
  {
    state: 'West Bengal',
    districts: [
      { name: 'Kolkata', lat: 22.5726, lon: 88.3639, popularLocations: ['Koley Market Wholesale', 'Mechua Fruit Mandi', 'Posta Bazar', 'Sealdah Agro Hub'] },
      { name: 'Hooghly', lat: 22.9038, lon: 88.3968, popularLocations: ['Sheoraphuli APMC', 'Singur Potato Hub', 'Tarakeswar Mandi', 'Chinsurah'] },
      { name: 'Bardhaman (Purba Bardhaman)', lat: 23.2324, lon: 87.8615, popularLocations: ['Burdwan Rice Bowl APMC', 'Kalna Mandi', 'Katwa', 'Memari'] },
      { name: 'Siliguri (Darjeeling)', lat: 26.7271, lon: 88.3953, popularLocations: ['Regulated Market Siliguri', 'Matigara Mandi', 'Kurseong Tea Belt', 'Mirik'] },
      { name: 'Malda', lat: 25.0108, lon: 88.1411, popularLocations: ['Samsi Mango APMC', 'English Bazar Mandi', 'Old Malda', 'Chanchal'] },
      { name: 'Nadia', lat: 23.4710, lon: 88.5565, popularLocations: ['Krishnanagar APMC', 'Ranaghat Mandi', 'Karimpur', 'Chakdaha'] },
      { name: 'Murshidabad', lat: 24.1759, lon: 88.2802, popularLocations: ['Baharampur APMC', 'Jiaganj Jute Mandi', 'Kandi', 'Lalgola'] }
    ]
  },
  {
    state: 'Odisha',
    districts: [
      { name: 'Bhubaneswar (Khurda)', lat: 20.2961, lon: 85.8245, popularLocations: ['Unit-1 Haat APMC', 'Jatni Mandi', 'Khordha Town Hub', 'Balipatna'] },
      { name: 'Cuttack', lat: 20.4625, lon: 85.8828, popularLocations: ['Malgodown Wholesale Mandi', 'Chhatrabazar APMC', 'Athagarh', 'Banki'] },
      { name: 'Sambalpur', lat: 21.4669, lon: 83.9812, popularLocations: ['Khetrajpur APMC', 'Rairakhol Mandi', 'Kuchinda Chilli Hub', 'Attabira'] },
      { name: 'Puri', lat: 19.8135, lon: 85.8312, popularLocations: ['Puri RMC Mandi', 'Pipili Agro Hub', 'Nimapada Milk/Veg Belt', 'Brahmagiri'] },
      { name: 'Bargarh', lat: 21.3340, lon: 83.6190, popularLocations: ['Bargarh Rice Bowl RMC', 'Attabira Mandi', 'Barpali Weaver/Agri Zone', 'Padampur'] }
    ]
  },
  {
    state: 'Kerala',
    districts: [
      { name: 'Kozhikode (Calicut)', lat: 11.2588, lon: 75.7804, popularLocations: ['Palayam Wholesale Market', 'Valayanad Agro Hub', 'Vadakara Coconut Mandi', 'Koyilandy'] },
      { name: 'Ernakulam (Kochi)', lat: 9.9816, lon: 76.2999, popularLocations: ['Ernakulam Broadway Market', 'Aluva APMC', 'Muvattupuzha Pineapple Hub', 'Perumbavoor'] },
      { name: 'Thiruvananthapuram', lat: 8.5241, lon: 76.9366, popularLocations: ['Chalaprom Market', 'Nedumangad Agro Mandi', 'Attingal', 'Neyyattinkara'] },
      { name: 'Thrissur', lat: 10.5276, lon: 76.2144, popularLocations: ['Sakthan Thampuran Wholesale Market', 'Wadakkanchery', 'Chalakudy', 'Kunnamkulam'] },
      { name: 'Palakkad', lat: 10.7867, lon: 76.6548, popularLocations: ['Palakkad Granary Hub', 'Chittur Jaggery Mandi', 'Alathur', 'Ottapalam'] },
      { name: 'Kottayam', lat: 9.5916, lon: 76.5222, popularLocations: ['Kottayam Rubber Hub', 'Pala Spices Market', 'Changanassery', 'Kanjirappally'] },
      { name: 'Idukki', lat: 9.9189, lon: 76.9725, popularLocations: ['Nedumkandam Spices APMC', 'Kumily Cardamom Hub', 'Munnar Tea Hills', 'Adimali'] },
      { name: 'Wayanad', lat: 11.6854, lon: 76.1320, popularLocations: ['Kalpetta Coffee Hub', 'Sulthan Bathery Pepper Mandi', 'Mananthavady', 'Meenangadi'] }
    ]
  },
  {
    state: 'Assam',
    districts: [
      { name: 'Guwahati (Kamrup Metro)', lat: 26.1445, lon: 91.7362, popularLocations: ['Pamohi Regulated Market', 'Fancy Bazar Wholesale', 'Khetri Farm Zone', 'Sonapur'] },
      { name: 'Dibrugarh', lat: 27.4728, lon: 94.9120, popularLocations: ['Chowkidinghee APMC', 'Naharkatiya Tea Hub', 'Chabua', 'Moran'] },
      { name: 'Jorhat', lat: 26.7509, lon: 94.2037, popularLocations: ['Jorhat Tea Research Hub', 'Titabar Rice Bowl', 'Teok', 'Mariani'] },
      { name: 'Nagaon', lat: 26.3452, lon: 92.6841, popularLocations: ['Dhing APMC (Jute Hub)', 'Samaguri Mandi', 'Kaliabor', 'Raha'] }
    ]
  },
  {
    state: 'Chhattisgarh',
    districts: [
      { name: 'Raipur', lat: 21.2514, lon: 81.6296, popularLocations: ['Dumartarai Wholesale Mandi', 'Tilda APMC', 'Abhanpur Farm Hub', 'Arang'] },
      { name: 'Bilaspur', lat: 22.0797, lon: 82.1409, popularLocations: ['Bilaspur Krishi Upaj Mandi', 'Kota APMC', 'Takhatpur', 'Bilha'] },
      { name: 'Durg-Bhilai', lat: 21.1904, lon: 81.2849, popularLocations: ['Durg Krishi Mandi', 'Patan Farm Hub', 'Bhilai Agro Zone', 'Dhamdha Vegetable Belt'] },
      { name: 'Rajnandgaon', lat: 21.1017, lon: 81.0335, popularLocations: ['Rajnandgaon APMC', 'Dongargarh Mandi', 'Khairagarh', 'Chhuikhadan'] },
      { name: 'Dhamtari', lat: 20.7071, lon: 81.5497, popularLocations: ['Dhamtari Rice City APMC', 'Kurud Mandi', 'Nagri', 'Magarlod'] }
    ]
  },
  {
    state: 'Jharkhand',
    districts: [
      { name: 'Ranchi', lat: 23.3441, lon: 85.3096, popularLocations: ['Pandra Bazar Samiti APMC', 'Kanke BAU Farm Hub', 'Ormanjhi Veg Belt', 'Namkum'] },
      { name: 'Jamshedpur (East Singhbhum)', lat: 22.8046, lon: 86.2029, popularLocations: ['Golmuri Krishi Mandi', 'Chakulia APMC', 'Ghatshila', 'Baharagora'] },
      { name: 'Dhanbad', lat: 23.7957, lon: 86.4304, popularLocations: ['Barwadda Bazar Samiti', 'Govindpur Mandi', 'Nirsa', 'Tundi'] },
      { name: 'Hazaribagh', lat: 23.9925, lon: 85.3637, popularLocations: ['Hazaribagh Bazar Samiti', 'Barhi Mandi', 'Barkagaon', 'Chouparan'] }
    ]
  },
  {
    state: 'Uttarakhand',
    districts: [
      { name: 'Dehradun', lat: 30.3165, lon: 78.0322, popularLocations: ['Niranjanpur Mandi APMC', 'Rishikesh Agro Hub', 'Vikasnagar Basmati Belt', 'Doiwala'] },
      { name: 'Haridwar', lat: 29.9457, lon: 78.1642, popularLocations: ['Jwalapur APMC', 'Roorkee Mandi', 'Laksar Sugar Belt', 'Bhagwanpur'] },
      { name: 'Udham Singh Nagar (Rudrapur/Kashipur)', lat: 28.9798, lon: 79.4000, popularLocations: ['Kashipur Mandi APMC', 'Rudrapur Granary Hub', 'Kichha', 'Gadarpur', 'Jaspur'] },
      { name: 'Nainital (Haldwani)', lat: 29.2183, lon: 79.5130, popularLocations: ['Haldwani Fruit & Veg APMC (Gateway to Kumaon)', 'Ramnagar Mandi', 'Bhimtal', 'Mukteshwar Apple Belt'] }
    ]
  },
  {
    state: 'Himachal Pradesh',
    districts: [
      { name: 'Shimla', lat: 31.1048, lon: 77.1734, popularLocations: ['Dhalli APMC (Apple Hub)', 'Theog Fruit Mandi', 'Rohru Apple Belt', 'Rampur Bushahr'] },
      { name: 'Kullu', lat: 31.9579, lon: 77.1095, popularLocations: ['Kullu Fruit Mandi', 'Bhuntar APMC', 'Manali Horticulture Zone', 'Anni'] },
      { name: 'Solan', lat: 30.9045, lon: 77.0967, popularLocations: ['Solan Mushroom City APMC', 'Kandaghat Veg Hub', 'Nalagarh', 'Baddi'] },
      { name: 'Kangra (Dharamshala)', lat: 32.2190, lon: 76.3234, popularLocations: ['Kangra APMC', 'Palampur Tea Hills', 'Nurpur', 'Dehra Gopipur'] },
      { name: 'Mandi', lat: 31.7087, lon: 76.9320, popularLocations: ['Mandi APMC', 'Sundernagar Mandi', 'Sarkaghat', 'Jogindernagar'] }
    ]
  },
  {
    state: 'Delhi (NCT)',
    districts: [
      { name: 'New Delhi', lat: 28.6139, lon: 77.2090, popularLocations: ['IARI Pusa Campus Hub', 'Khan Market Agro Center', 'Central Delhi Area'] },
      { name: 'North Delhi', lat: 28.7041, lon: 77.1025, popularLocations: ['Azadpur Mandi (Asia Largest Fruit & Veg Market)', 'Narela APMC (Grain Market)', 'Alipur Farm Hub'] },
      { name: 'South Delhi', lat: 28.4817, lon: 77.1873, popularLocations: ['Okhla APMC Mandi', 'Mehrauli Farm Belt', 'Chhatarpur Agro Zone'] },
      { name: 'East Delhi', lat: 28.6277, lon: 77.2784, popularLocations: ['Ghazipur Flower & Poultry APMC', 'Mayur Vihar Area', 'Anand Vihar'] },
      { name: 'West Delhi', lat: 28.6669, lon: 77.0689, popularLocations: ['Keshopur Wholesale Fruit & Veg APMC', 'Najafgarh Grain Mandi', 'Tikri Kalan'] }
    ]
  },
  {
    state: 'Jammu & Kashmir',
    districts: [
      { name: 'Srinagar', lat: 34.0837, lon: 74.7973, popularLocations: ['Parimpora Fruit Mandi', 'Batamaloo', 'Hazratbal', 'Nowhatta'] },
      { name: 'Jammu', lat: 32.7266, lon: 74.8570, popularLocations: ['Narwal Fruit & Grain Mandi', 'RS Pura Basmati Belt', 'Bishnah', 'Akhnoor'] },
      { name: 'Anantnag', lat: 33.7311, lon: 75.1487, popularLocations: ['Anantnag Apple APMC', 'Bijbehara Mandi', 'Dooru', 'Pahalgam'] },
      { name: 'Baramulla', lat: 34.2001, lon: 74.3436, popularLocations: ['Sopore Fruit Mandi (Asia 2nd Largest Apple Mandi)', 'Pattan', 'Uri'] }
    ]
  },
  {
    state: 'Goa',
    districts: [
      { name: 'North Goa', lat: 15.4989, lon: 73.8278, popularLocations: ['Mapusa Municipal Subzi Mandi', 'Panaji Wholesale Market', 'Bicholim', 'Pernem Cashew Belt'] },
      { name: 'South Goa', lat: 15.2832, lon: 73.9862, popularLocations: ['Margao Gandhi Market', 'Ponda Spices Hub', 'Curchorem', 'Canacona'] }
    ]
  },
  {
    state: 'Tripura',
    districts: [
      { name: 'West Tripura (Agartala)', lat: 23.8315, lon: 91.2868, popularLocations: ['Battala Wholesale Market', 'Maharajganj Bazar APMC', 'Ranirbazar', 'Jirania'] }
    ]
  },
  {
    state: 'Meghalaya',
    districts: [
      { name: 'East Khasi Hills (Shillong)', lat: 25.5788, lon: 91.8933, popularLocations: ['Iewduh (Bara Bazar) Shillong', 'Mawlonghat Wholesale Market', 'Smit Farm Hub'] }
    ]
  },
  {
    state: 'Manipur',
    districts: [
      { name: 'Imphal West', lat: 24.8170, lon: 93.9368, popularLocations: ['Ima Keithel (Mother Market)', 'Lamphelpat Agro Hub', 'Sagolband'] }
    ]
  },
  {
    state: 'Nagaland',
    districts: [
      { name: 'Dimapur', lat: 25.9090, lon: 93.7270, popularLocations: ['Dimapur Super Market APMC', 'Medziphema Organic Hub', 'Chumukedima'] }
    ]
  },
  {
    state: 'Mizoram',
    districts: [
      { name: 'Aizawl', lat: 23.7271, lon: 92.7176, popularLocations: ['Bara Bazar Aizawl', 'Thuampui Agro Market', 'Zemabawk'] }
    ]
  },
  {
    state: 'Sikkim',
    districts: [
      { name: 'East Sikkim (Gangtok)', lat: 27.3389, lon: 88.6065, popularLocations: ['Lall Bazaar Gangtok (Organic Market)', 'Singtam Agro APMC', 'Ranipool'] }
    ]
  },
  {
    state: 'Arunachal Pradesh',
    districts: [
      { name: 'Papum Pare (Itanagar)', lat: 27.0844, lon: 93.6053, popularLocations: ['Ganga Market Itanagar', 'Naharlagun Wholesale Hub', 'Nirjuli'] }
    ]
  },
  {
    state: 'Ladakh',
    districts: [
      { name: 'Leh', lat: 34.1526, lon: 77.5771, popularLocations: ['Leh Main Bazar Agro Hub', 'Choglamsar Apricot/Seabuckthorn Zone', 'Thiksey'] }
    ]
  },
  {
    state: 'Chandigarh',
    districts: [
      { name: 'Chandigarh', lat: 30.7333, lon: 76.7794, popularLocations: ['Sector 26 Grain & Fruit APMC Mandi', 'Sector 39 Wholesale Market', 'Manimajra'] }
    ]
  },
  {
    state: 'Puducherry',
    districts: [
      { name: 'Puducherry', lat: 11.9416, lon: 79.8083, popularLocations: ['Goubert Market Pondicherry', 'Thattanchavady Market Committee APMC', 'Villianur'] }
    ]
  }
];

export const getDistrictCoordinates = (stateName: string, districtName: string): { lat: number; lon: number; name: string } | null => {
  const matchedState = INDIA_STATES_DATA.find(
    (s) => s.state.toLowerCase() === stateName.trim().toLowerCase()
  );
  if (!matchedState) {
    // Fallback: search across all states
    for (const s of INDIA_STATES_DATA) {
      const d = s.districts.find(
        (dist) => dist.name.toLowerCase() === districtName.trim().toLowerCase() ||
                  dist.name.toLowerCase().includes(districtName.trim().toLowerCase()) ||
                  districtName.trim().toLowerCase().includes(dist.name.toLowerCase())
      );
      if (d) return { lat: d.lat, lon: d.lon, name: d.name };
    }
    return null;
  }

  const d = matchedState.districts.find(
    (dist) => dist.name.toLowerCase() === districtName.trim().toLowerCase() ||
              dist.name.toLowerCase().includes(districtName.trim().toLowerCase()) ||
              districtName.trim().toLowerCase().includes(dist.name.toLowerCase())
  );
  return d ? { lat: d.lat, lon: d.lon, name: d.name } : null;
};
