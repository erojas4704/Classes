def valid_parentheses(parens):
    """Are the parentheses validly balanced?

        >>> valid_parentheses("()")
        True

        >>> valid_parentheses("()()")
        True

        >>> valid_parentheses("(()())")
        True

        >>> valid_parentheses(")()")
        False

        >>> valid_parentheses("())")
        False

        >>> valid_parentheses("((())")
        False

        >>> valid_parentheses(")()(")
        False
    """

 #   endIndex = -1
 #   count = len(parens)
 #   
 #   for i, char in enumerate(parens):
 #       if char == "(":
 #           valid = False
 #           remainder = parens[::-1][i:endIndex]
#
 #           print(f"Start: {remainder}")
 #           for (i2, close) in enumerate(remainder):
 #               if close == ")": 
 #                   valid = True
 #                   endIndex = count - i2
 #                   break
 #               
 #           print(f"{remainder} Valid? {valid} {i} {endIndex}")
 #           if not valid: return False

    goints = 0
    for char in parens:
        if char == "(":
            goints += 1
        elif char == ")":
            goints -= 1
        
        if goints < 0:
            return False

    print(goints)

    return True if goints == 0 else False
            