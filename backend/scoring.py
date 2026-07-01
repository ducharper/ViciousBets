def calculate_leg_score(prediction, actual):
    """
    Calculates the score for a single prediction leg.
    Returns a value between 0 and 1.
    Takes in the user's prediction and the actual stat.
    """
    return max(0, 1 - abs(prediction - actual) / max(actual, 1))

def calculate_match_score(predictions, actuals):
    """
    Calculates a player's total match score (T) across all legs.
    Returns T, a float between 0 and 6.

    predictions: list of the player's predicated values, ex. [26, 4, 0, 12, 6, 8]
    actuals: list of actual stat outcomes in the same order, ex. [27, 6, 1, 12, 10, 8]
    """
    total = 0
    for prediction, actual in zip(predictions, actuals):
        total += calculate_leg_score(prediction, actual)
    return total


def determine_winner(player1_predictions, player2_predictions, actuals):
    """
    Compares two players' scores against the same slate of actual results.
    Returns winner ("player1", "player2", or "tie") and both scores.
    """
    player1_score = calculate_match_score(player1_predictions, actuals)
    player2_score = calculate_match_score(player2_predictions, actuals)

    if player1_score > player2_score:
        return "player1", player1_score, player2_score
    elif player2_score > player1_score:
        return "player2", player1_score, player2_score
    else:
        return "tie", player1_score, player2_score