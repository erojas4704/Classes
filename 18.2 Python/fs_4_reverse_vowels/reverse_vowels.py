def reverse_vowels(s):
    """Reverse vowels in a string.

    Characters which re not vowels do not change position in string, but all
    vowels (y is not a vowel), should reverse their order.

    >>> reverse_vowels("Hello!")
    'Holle!'

    >>> reverse_vowels("Tomatoes")
    'Temotaos'

    >>> reverse_vowels("Reverse Vowels In A String")
    'RivArsI Vewols en e Streng'

    reverse_vowels("aeiou")
    'uoiea'

    reverse_vowels("why try, shy fly?")
    'why try, shy fly?''
    """

    vowels = []
    for i, char in enumerate(s):
        if char.lower() in 'aeiou':
            vowels.append( (char, i))

    lst = list(s[::])
    
    for i, t in enumerate(vowels):
        lst[vowels[::-1][i][1]] = t[0]

    print(lst)

    return ''.join(lst)
        
