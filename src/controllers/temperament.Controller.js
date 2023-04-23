const {Temperament} = require("../db/db")
const axios = require("axios")

const createTemperament = async(req, res) => {
    try {

        const { data } = await axios.get(
          "https://api.thedogapi.com/v1/breeds?api_key=BEM4VPYma78fkZ5pe0B5NQz7YMDwovXi"
        );
    
        const temperament = await Temperament.findByPk(124)
        
    
        if(!temperament){
    
            for (const element of data) {
                if (element.temperament) {
          
                  const clean = element.temperament.split(",");
          
                  for (const item of clean) {
                    const [temperament , created] = await Temperament.findOrCreate({
                      where: {
                        name: item.trim(),
                      },
                    });
                  }
                }
              }
    
              return res.json("primer peticion").status(200);
        }
    
        const temperaments = await Temperament.findAll()
    
        res.json(temperaments).status(200)
      
    
      } catch (error) {
        console.log(error.message);
      }
}

module.exports = {createTemperament}