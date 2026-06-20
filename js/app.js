// Logika aplikacji i kalkulator kosztów
function calculateCosts() {
    const income = parseFloat(document.getElementById('monthly-income').value) || 0;
    const cardSpent = parseFloat(document.getElementById('card-transactions').value) || 0;
    const age = parseInt(document.getElementById('user-age').value) || 0;
    const atmFilter = document.getElementById('atm-requirement').value;

    const container = document.getElementById('banks-container');
    if (!container) return;
    container.innerHTML = '';

    bankData.forEach(bank => {
        let accountFee = bank.baseAccountFee;
        let cardFee = bank.baseCardFee;

        // Sprawdzenie warunku wiekowego (Konto dla Młodych)
        if (age <= bank.youthMaxAge) {
            accountFee = 0;
            cardFee = bank.youthCardFee;
        } else {
            // 1. Sprawdzenie opłaty za konto
            if (bank.minIncomeForFreeAccount > 0 && income >= bank.minIncomeForFreeAccount) {
                if (bank.isSingleTransactionRequirement || bank.bankName === "Bank Pekao S.A.") {
                    if (cardSpent > 0) accountFee = 0;
                } else {
                    accountFee = 0;
                }
            }

            // 2. Sprawdzenie opłaty za kartę
            if (bank.isTransactionCountBased) {
                if (cardSpent >= 150) cardFee = 0;
            } else if (bank.isSingleTransactionRequirement) {
                if (cardSpent > 0 && income >= bank.minIncomeForFreeAccount) cardFee = 0;
            } else {
                if (cardSpent >= bank.minCardTransactionsForFree) {
                    cardFee = 0;
                }
            }
        }

        const totalMonthlyCost = accountFee + cardFee;

        const cardHtml = `
            <div class="bank-card">
                <div class="bank-logo-section">
                    <div class="bank-name">${bank.bankName}</div>
                    <div class="account-name">${bank.accountName}</div>
                    \${bank.promoText ? `<span class="badge-promo">\${bank.promoText}</span>` : ''}
                </div>
                
                <div class="fee-column">
                    <div class="fee-value \${accountFee === 0 ? 'free' : ''}">\${accountFee === 0 ? '0 zł' : accountFee + ' zł'}</div>
                    <div class="fee-label">Prowadzenie konta</div>
                </div>

                <div class="fee-column">
                    <div class="fee-value \${cardFee === 0 ? 'free' : ''}">\${cardFee === 0 ? '0 zł' : cardFee + ' zł'}</div>
                    <div class="fee-label">Opłata za kartę</div>
                </div>

                <div class="features-column">
                    <ul>
                        <li>Koszt łączny: <strong>\${totalMonthlyCost} zł / mies.</strong></li>
                        <li>Bankomaty: \${bank.atmFee}</li>
                        <li>BLIK, Google Pay, Apple Pay</li>
                    </ul>
                </div>

                <div class="action-column">
                    <a href="\${bank.affiliateUrl}" target="_blank" class="btn-apply">Otwórz konto</a>
                </div>
            </div>
        `;
        container.innerHTML += cardHtml;
    });
}

// Rejestracja zdarzeń po załadowaniu DOM
document.addEventListener('DOMContentLoaded', () => {
    calculateCosts();
    
    // Słuchacze zmian w formularzu
    document.getElementById('monthly-income').addEventListener('input', calculateCosts);
    document.getElementById('card-transactions').addEventListener('input', calculateCosts);
    document.getElementById('user-age').addEventListener('input', calculateCosts);
    document.getElementById('atm-requirement').addEventListener('change', calculateCosts);
});
