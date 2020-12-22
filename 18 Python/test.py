import time
import random

score = 0
streak = 0

def promptNumber(number, next):
    global score
    global streak
    time.sleep(.5)
    guess = input(f"I'm thinking of a number. Is it (H)igher, (L)ower, or (E)qual to {number}?  ")
    guess = guess.lower()[0:1]

    if guess != "e" and guess != "h" and guess != "l":
        print("What the fuck is that guess? Try again, dipstick")
        time.sleep(.5)
        promptNumber(number, next)
        return

    if checkGuess (guess, number, next):
        print("You guessed right! Good job, dickwad.")
        if streak > 1:
            print(f"Streak: {streak}")
        score += 1
        streak += 1
    else:
        print("no. you fucked this up loser.")
        streak = 0
    
    print(f"Score {score}")
    time.sleep(.5)
    promptNumber(next, random.randint(0, 10))

def checkGuess(guess, number, next):
    if next == number and guess == "e":
        return True
    elif next > number and guess == "h":
        return True
    elif next < number and guess == "l":
        return True
    return False




play = input("wanna play cunt?  ")

if play.lower()[0:1] == "y":
    print("ok you're in for it now bitch")
elif play.lower()[0:1] == "n":
    print("ok bye loser im destroying your computer now")
else:
    print("what the fuck did u say to me bitch i dont speak imbecile")


time.sleep(1)
print("Ok ima give you a number, bitch. guess if the next one is (h) higher or (l) lower.")
time.sleep(1)
print("Think you can do that?")
time.sleep(.5)
print("OK 3...")
time.sleep(.5)
print("OK 2...")
time.sleep(.5)
print("OK 1...")
time.sleep(.5)
print("Go bitch.")

number = random.randint(0, 10)
print(f"Your number is {number}!")

promptNumber(number, random.randint(0, 10))

