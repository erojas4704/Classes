-- Comments in SQL Start with dash-dash --
--1
INSERT INTO products (name, price, can_be_returned)
VALUES ('chair', 44.00, false),
('stool', 25.99, true),
('table', 124.00, false);
--2
SELECT name, price, can_be_returned FROM products;
--3
SELECT name FROM products;
--4
SELECT name, price FROM products;
--5
INSERT INTO products (name, price, can_be_returned)
VALUES ('Giant Dildo', 99.99, true);
--6
SELECT name FROM products WHERE can_be_returned=true;
--7
SELECT name, price FROM products WHERE price < 44.00;
--8
SELECT name, price FROM products WHERE price BETWEEN 22.50 AND 99.99;
--9
UPDATE products SET price = price * .8;
--10
DELETE FROM products WHERE price < 25;
--11
UPDATE products SET price = price + 20;
--12
UPDATE products SET can_be_returned = true;

