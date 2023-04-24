const { Dog, Temperament } = require("../db/db");
const axios = require("axios");

const createDog = async (req, res) => {
  const { name, life_span, weight, height, image, temperament } = req.body;
  try {
    const dog = await Dog.create({ name, life_span, weight, height, image });

    const temperamentDb = await Temperament.findAll({
      where: {
        name: temperament,
      },
    })
    dog.addTemperament(temperamentDb);
    res.status(201).json({ message: "agregado con exito" });
  } catch (err) {
    res.status(400).json({ err: err.message });
}};

const getDogByIdRaza = async (req, res) => {
  const { id } = req.params;
  const source = isNaN(id) ? "db" : "api";
  try {
      if(source == "api") {     
        const { data } = await axios.get(
            `https://api.thedogapi.com/v1/breeds?api_key=BEM4VPYma78fkZ5pe0B5NQz7YMDwovXi`
          );
          const dataClean = data.map((res) => {
            return {
              id: res.id,
              name: res.name,
              life_span: res.life_span,
              weight: res.weight.imperial,
              height: res.height.imperial,
              image: res.image.url,
              temperaments: res.temperament,
            };
          });
          const result = dataClean.find(res => res.id == id);
          res.json(result).status(200);
      }else{
        const dog = await Dog.findByPk(id, {
          include: [
            {
              model: Temperament,
              attributes: ["name"],
              through: {
                attributes: [],
              },
            },
          ],
        });
        const result = [dog].map(element => {
          return {
            id: element.id,
            name: element.name,
            life_span: element.life_span,
            weight: element.weight,
            height: element.height,
            image: element.image,
            createdInDb: element.createdInDb,
            temperaments: element.temperaments.map(obj => obj.name).join(', ')
          };
        });

        res.status(200).json(result);
      }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Buscar todos los dogs o por query;
const getDog = async (req, res) => {

  const {name} = req.query;
  
  try {
   if(name){
    const dogs = await Dog.findAll({
      include: [
        {
          model: Temperament,
          attributes: ["name"],
          through: {
            attributes: [],
          },
        },
      ],
    });

    const resultDogs = dogs.map(element => {
      return {
        id: element.id,
        name: element.name,
        life_span: element.life_span,
        weight: element.weight,
        height: element.height,
        image: element.image, 
        createdInDb:element.createdInDb,
        temperaments: element.temperaments.map(obj => obj.name).join(', ')
      };
    });

    const { data } = await axios.get(
        `https://api.thedogapi.com/v1/breeds?api_key=BEM4VPYma78fkZ5pe0B5NQz7YMDwovXi`
      );
      const dataClean = data.map((res) => {
        return {
          id: res.id,
          name: res.name,
          life_span: res.life_span,
          weight: res.weight.imperial,
          height: res.height.imperial,
          image: res.image.url,
          temperaments: res.temperament,
        };
      });
      const response = [...resultDogs,...dataClean];
      const result = response.filter(res => res.name.toLowerCase().includes(name.toLowerCase()));
      res.json(result).status(200);

   }else{

    const { data } = await axios.get(
        "https://api.thedogapi.com/v1/breeds?api_key=BEM4VPYma78fkZ5pe0B5NQz7YMDwovXi"
      );
      const dataClean = data.map((res) => {
        return {
          id: res.id,
          name: res.name,
          life_span: res.life_span,
          weight: res.weight.imperial,
          height: res.height.imperial,
          image: res.image.url,
          temperaments: res.temperament,
        };
      });
      const dogs = await Dog.findAll({
        include: [
          {
            model: Temperament,
            attributes: ["name"],
            through: {
              attributes: [],
            },
          },
        ],
      });
      
      const resultDogs = dogs.map(element => {
        return {
          id: element.id,
          name: element.name,
          life_span: element.life_span,
          weight: element.weight,
          height: element.height,
          image: element.image, 
          createdInDb: element.createdInDb,
          temperaments: element.temperaments.map(obj => obj.name).join(', ')
        };
      });

      const response = [...resultDogs, ...dataClean];
      
      res.json(response).status(200);
   }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createDog, getDog, getDogByIdRaza };
