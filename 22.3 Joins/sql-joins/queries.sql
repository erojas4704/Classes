-- write your queries here

--1
SELECT * FROM vehicles
JOIN owners
ON vehicles.owner_id = owners.id;

SELECT * FROM owners JOIN vehicles ON vehicles.owner_id = owners.id;

--2

SELECT 
(SELECT first_name FROM owners WHERE owners.id = owner_id),
(SELECT last_name FROM owners WHERE owners.id = owner_id),
COUNT(*) 
FROM owners
INNER JOIN vehicles ON vehicles.owner_id = owners.id
GROUP BY owner_id
ORDER BY first_name;

--3

SELECT first_name, last_name,
AVG(price)
FROM owners
INNER JOIN vehicles ON vehicles.owner_id = owners.id
GROUP BY (first_name, last_name)
HAVING count(owner_id) > 1 AND AVG(price) > 10000
ORDER BY first_name DESC;

--Exercises

--1
SELECT matchid, player 
FROM game
INNER JOIN goal ON goal.matchid = game.id
WHERE teamid = 'GER';

--2
SELECT id,stadium,team1,team2
  FROM game WHERE id = 1012;

--3
SELECT player, teamid, stadium, mdate
  FROM game JOIN goal ON (id=matchid)
  WHERE teamid = 'GER';

--4
SELECT team1, team2, player
  FROM game JOIN goal ON (id=matchid)
  WHERE player LIKE 'Mario%'

--5
SELECT player, teamid, coach, gtime
  FROM goal JOIN eteam on teamid=id
 WHERE gtime<=10

--6
SELECT mdate, teamname
FROM game JOIN eteam ON (team1 = eteam.id)
WHERE coach = 'Fernando Santos'

--7
SELECT player
FROM goal
JOIN game ON (id = goal.matchid)
WHERE stadium LIKE 'National Stadium, Warsaw';

--8
SELECT player
  FROM game JOIN goal ON matchid = id 
    WHERE (team1='GER' OR team2='GER') AND goal.teamid <> 'GER'
GROUP BY player;

--9
SELECT teamname, COUNT(*)
  FROM eteam JOIN goal ON id=teamid
GROUP BY teamname
 ORDER BY teamname

--10
 SELECT stadium, COUNT(*)
FROM game JOIN goal ON matchid = id
GROUP BY stadium

--11
SELECT matchid, mdate, COUNT(*)
FROM game JOIN goal ON matchid = id 
WHERE (team1 = 'POL' OR team2 = 'POL')
GROUP BY matchid, mdate

--12
SELECT matchid, mdate, COUNT(*)
FROM game JOIN goal ON matchid = id
WHERE goal.teamid = 'GER'
GROUP BY matchid, mdate

--13 bad
SELECT mdate,
  team1,
  CASE WHEN teamid=team1 THEN 1 ELSE 0 END score1,
  team2,
  CASE WHEN teamid=team2 THEN 1 ELSE 0 END score2
  FROM game JOIN goal ON matchid = id