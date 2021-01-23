def three_odd_numbers(nums):
    """Is the sum of any 3 sequential numbers odd?"

        >>> three_odd_numbers([1, 2, 3, 4, 5])
        True

        >>> three_odd_numbers([0, -2, 4, 1, 9, 12, 4, 1, 0])
        True

        >>> three_odd_numbers([5, 2, 1])
        False

        >>> three_odd_numbers([1, 2, 3, 3, 2])
        False
    """

    count = len(nums)
    for i, n in enumerate(nums):
        sum = 0
        if i + 3 <= count:
            sequence = nums[i:i+3]
            for c in sequence:
                sum += c
                print(sequence, sum)
            if sum % 2 != 0:
                return True
    
    return False
