import React, { useState } from 'react';
import axios from 'axios';
import api from '../../util/api';

const CompareBox = () => {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [compareResult, setCompareResult] = useState('');
  const [leftImage, setLeftImage] = useState(null);
  const [rightImage, setRightImage] = useState(null);

  // Function to determine color based on match quality
  const getMatchColor = (matchQuality) => {
    switch(matchQuality) {
      case 'Very Good Match':
        return '#28a745'; // Green
      case 'Good Match':
        return '#20c997'; // Teal
      case 'Possible Match':
        return '#ffc107'; // Amber/Yellow
      case 'Average Possible':
        return '#fd7e14'; // Orange
      case 'Rare Possible':
        return '#dc3545'; // Red
      default:
        return '#6c757d'; // Gray
    }
  };



  const handleImage1Upload = (e) => {
    try {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        setImage1(file);
        setLeftImage(URL.createObjectURL(file));
      } else {
        console.warn('No file selected for image 1');
      }
    } catch (error) {
      console.error('Error uploading image 1:', error);
    }
  };

  const handleImage2Upload = (e) => {
    try {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        setImage2(file);
        setRightImage(URL.createObjectURL(file));
      } else {
        console.warn('No file selected for image 2');
      }
    } catch (error) {
      console.error('Error uploading image 2:', error);
    }
  };

  const handleUpload = async () => {
    if (!image1 || !image2) {
      console.error('Please select both images');
      return;
    }

    const formData = new FormData();
    formData.append('image1', image1);
    formData.append('image2', image2);

    try {
      const response = await axios.post(`${api.url}:8000/compare`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Upload success:', response.data);
      
      // Handle both old format (just number) and new format (object with best_match, best_pair, all_pairs, faces_found)
      const result = response.data.result;
      if (typeof result === 'object' && result !== null && 'best_match' in result) {
        // New format - extract the best_match value
        setCompareResult(result);
      } else {
        // Old format - wrap in object for consistency
        setCompareResult({ best_match: result, best_pair: null, all_pairs: [], faces_found: {} });
      }
      // Handle success (e.g., show a success message)
    } catch (error) {
      console.error('Error uploading images:', error);
      // Handle error (e.g., show an error message)
    }
  };
  return (
    <div className='info'>
      <h1 className="text-center mt-5 mb-4">Compare Page</h1>
      <div className="row mb-4 m-4">
        <div className="col-md-6 text-center" style={{ borderRight: '1px solid black' }}>
          <input type="file" accept="image/*" onChange={handleImage1Upload} />
          {leftImage && <img src={leftImage} alt="Left Image" className="img-fluid mt-3" style={{minHeight:'400px', maxHeight:'400px', maxWidth: '100%', height: 'auto' }} />}

        </div>
        <div className="col-md-6 text-center" style={{ borderLeft: '1px solid black' }}>
          <input type="file" accept="image/*" onChange={handleImage2Upload} />
          {rightImage && <img src={rightImage} alt="Right Image" className="img-fluid mt-3" style={{minHeight:'400px', maxHeight:'400px', maxWidth: '100%', height: 'auto' }} />}
        </div>
      </div>
      <div className="row justify-content-center mb-4">
        <div className="col-md-7 text-center">
          <button className="btn btn-primary" onClick={handleUpload}>
            Compare
          </button>
        </div>
      </div>
      {compareResult && (
        <div className="row justify-content-center items-align-center text-center">
          <div className="col-md-8">
            <div className="result-box">
              <h3 style={{ color: getMatchColor(compareResult.best_pair?.match_quality) }}>
                {compareResult.best_pair?.match_quality || "Analyzing..."}</h3>
              <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
                {compareResult.best_match?.toFixed(2)}% Confidence
              </p>
              
              {compareResult.faces_found && (
                <p style={{ fontSize: '14px', color: '#666' }}>
                  Detected: {compareResult.faces_found.image1} face(s) in image 1, {compareResult.faces_found.image2} face(s) in image 2
                </p>
              )}
              
              {compareResult.best_pair && (
                <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                  <p><strong>Best Match Pair:</strong></p>
                  <p style={{ fontSize: '13px' }}>
                    Image 1 Face #{compareResult.best_pair.face1_index + 1} ↔ Image 2 Face #{compareResult.best_pair.face2_index + 1}
                  </p>
                  <p style={{ fontSize: '12px', color: '#555' }}>
                    Confidence: {compareResult.best_pair.confidence?.toFixed(2)}% | Similarity Score: {compareResult.best_pair.similarity?.toFixed(4)}
                  </p>
                </div>
              )}
              
              {compareResult.all_pairs && compareResult.all_pairs.length > 1 && (
                <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
                  <p><strong>All Face Comparisons ({compareResult.all_pairs.length}):</strong></p>
                  <div style={{ maxHeight: '150px', overflowY: 'auto', fontSize: '12px' }}>
                    {compareResult.all_pairs.map((pair, idx) => (
                      <p key={idx} style={{ margin: '5px 0', padding: '3px' }}>
                        Face{pair.face1_index + 1} ↔ Face{pair.face2_index + 1}: {pair.confidence?.toFixed(2)}% ({pair.match_quality})
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompareBox;
