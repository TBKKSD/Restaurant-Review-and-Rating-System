CREATE TABLE restaurants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT
);

CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  restaurant_id INT,
  rating INT,
  comment TEXT,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);