def print_upper_words(words, must_start_with=["e"]):
    for word in words:
        if word[0].lower() in must_start_with: print(word.upper())

print_upper_words(["Coño", "Mira", "Mang", "Elian"])