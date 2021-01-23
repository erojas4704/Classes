def find_factors(num):
    """Find factors of num, in increasing order.

    >>> find_factors(10)
    [1, 2, 5, 10]

    >>> find_factors(11)
    [1, 11]

    >>> find_factors(111)
    [1, 3, 37, 111]

    >>> find_factors(321421)
    [1, 293, 1097, 321421]
    """
    lower = []
    higher = []

    #n_list = [n for n in range (1, num // 2 + 1) if num % n == 0] <-- correct answer. touche
    
    i = 0
    while i < num + 1:
        i2 = i

        #slow. hangs
        while i2 < num + 1:
            if i2 * i == num:
                lower.append(i)
                higher.append(i2)
            i2 += 1

        i += 1

    
    return lower + higher