import React, { useState} from 'react';
import axios from "axios";
import { useContext } from 'react';
import { AuthContext } from '../context/authContext';

const IntresentNews = ({ currentUser }) => {
  const { setCurrentUser } = useContext(AuthContext);
  const [showCategoryList, setShowCategoryList] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [tempSelectedCategories, setTempSelectedCategories] = useState([]);

  const CatList = [
    "Riks",
    "Läns",
    "Öppen",
    "JAQT",
    "StockholmCentrala",
    "Hallstavik",
    "HaningeTyresö",
    "Lidingö",
    "Mälarö",
    "Norrort",
    "NorrtäljeNorra",
    "NorrtäljeSödra",
    "Nynäshamn",
    "Rimbo",
    "SolnaSundbyberg",
    "Söderort",
    "Södertälje",
    "UpplandsBro",
    "WermdöNacka",
    "VäsbySollentunaJärfälla",
    "Västerort",
    "ÖsteråkerVaxholm",
  ];

  const displayCategories = (category) => {
    switch (category) {
      case '':
        return 'Alla kategorier';
      case 'riks':
        return 'Riks';
      case 'lans':
        return 'Läns';
      case 'open':
        return 'Öppen';
      // Add more cases for other categories as needed
      default:
        return category;
    }
  };

  const handleInterestChange = () => {
    setShowCategoryList(!showCategoryList);
    setTempSelectedCategories([...selectedCategories]);
  };

  const handleCategorySelect = (event) => {
    const selectedCategory = event.target.value;
    if (selectedCategory === 'Alla kategorier') {
      setTempSelectedCategories(['Alla kategorier']);
    } else {
      if (tempSelectedCategories.includes('Alla kategorier')) {
        setTempSelectedCategories([selectedCategory]);
      } else {
        if (tempSelectedCategories.length < 2) {
          setTempSelectedCategories((prevTempSelectedCategories) => [
            ...prevTempSelectedCategories,
            selectedCategory,
          ]);
        }
      }
    }
  };

  const handleInterestSaving = async () => {
    try {
      const apiUrl = `${process.env.REACT_APP_API_URL}/api/users/updateUserIntress`;

      const mappedCategories = tempSelectedCategories.map(category => {
        switch (category) {
          case 'Alla kategorier':
            return '';
          case 'Riks':
            return 'riks';
          case 'Läns':
            return 'lans';
          case 'Öppen':
            return 'open';
          // Add more cases for other categories as needed
          default:
            return category;
        }
      });
      
      await axios.put(apiUrl, {
        userId: currentUser.id,
        intress1: mappedCategories[0],
        intress2: mappedCategories[1],
      });
      
      // Update the selected categories state
      setSelectedCategories([...tempSelectedCategories]);

      setCurrentUser({
        ...currentUser,
        intress1: mappedCategories[0],
        intress2: mappedCategories[1]
      });
      // Close the category list after saving
      setShowCategoryList(false);

    } catch (error) {
      console.error('Error updating user interests:', error);
    }
  };

  return (
    <div className='mt-5'>
      <h5>Intressanta nyheter: </h5>
      <div className='m-4 border-1 border p-2 w-100 d-flex justify-content-between'>
        
        {currentUser.intress1 &&  currentUser.intress2 ? (
          <div>
            <p className='mt-1 px-2 text-success'>Intresserad av: 
            <strong className='px-3 text-success'>{displayCategories(currentUser.intress1)} </strong> & 
            <strong className='px-3 text-success'>{displayCategories(currentUser.intress2)} </strong>nyheter</p>
          </div>
        ) : (
          <div>
            {currentUser.intress1 &&  !currentUser.intress2 ? (
              <div>
                <span className='mt-1 px-2 text-success'>Intresserad av: 
                <strong className='px-3 text-success'>{displayCategories(currentUser.intress1)} </strong>nyheter</span>
              </div>
            ) : (
              <div>
                {!currentUser.intress1 &&  currentUser.intress2 ? (
                  <div>
                    <span className='mt-1 px-2 text-success'>Intresserad av: 
                    <strong className='px-3 text-success'>{displayCategories(currentUser.intress2)} </strong>nyheter</span>
                  </div>
                ) : (
                  <div>
                    <span className='mt-1 px-2'>Alla nyheter</span>   
                  </div>

                )}  
              </div>
            )}  
          </div>
        )}



        <p className=' px-2'>
          <button className='btn btn-outline-success' onClick={handleInterestChange}>Ändra intresse</button>
        </p>
      </div>
      <div>
      {showCategoryList && (
          <div className='my-4 border-1 border p-2 w-50 mx-auto'>
            <div className='my-2 p-2 w-100 d-flex justify-content-between mx-auto'>
              <p className='mt-3 w-50'>Välj två intress:</p>
              <select
                className='form-select w-75 h-auto'
                multiple
                onChange={handleCategorySelect}
                size={6}
                value={tempSelectedCategories}
              >
                <option value='Alla kategorier'>Alla kategorier</option>
                {CatList.map((cat, index) => (
                  <option key={index} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className='mx-auto w-100 text-end'>
              <button className='btn btn-outline-success btn-sm' onClick={handleInterestSaving}>
                Ändra intresse
              </button>
              <p className='text-danger'><small>Efter...Du måste logga ut och logga in igen för att återställa data</small></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default IntresentNews;
