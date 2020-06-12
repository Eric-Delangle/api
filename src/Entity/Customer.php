<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\CustomerRepository;
use Doctrine\Common\Collections\Collection;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass=CustomerRepository::class)
 * Dans mon apiresource je créé un groupe de normalization pour selectionner les données que je veux afficher
 * @ApiResource(
 *  collectionOperations = {"GET", "POST"},
 * itemOperations = {"GET" , "PUT", "DELETE"},
 *  subresourceOperations = {
 *      "invoices_get_subresource" = {"path" = "/customers/{id}/invoices"}
 * },
 *  normalizationContext ={
 *      "groups" = {"customers_read"}
 * }
 * )
 */
class Customer
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @groups({"customers_read", "invoices_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @groups({"customers_read", "invoices_read"})
     * @Assert\NotBlank(message = "Le prénom est obligatoire.")
     * @Assert\Length(min= 3, minMessage = "Le prénom doit contenir entre 3 et 255 caractères.", max=255, maxMessage = "Le prénom doit contenir entre 3 et 255 caractères.")
     */
    private $firstName;

    /**
     * @ORM\Column(type="string", length=255)
     * @groups({"customers_read", "invoices_read"})
     * @Assert\NotBlank(message = "Le nom de famille est obligatoire.")
     * @Assert\Length(min= 3, minMessage = "Le nom de famille doit contenir entre 3 et 255 caractères.", max=255, maxMessage = "Le prénom doit contenir entre 3 et 255 caractères.")
     */
    private $lastName;

    /**
     * @ORM\Column(type="string", length=255)
     * @groups({"customers_read", "invoices_read"})
     * @Assert\NotBlank(message = "L'adresse email est obligatoire.")
     * @Assert\Email(message="l'adresse email doit être valide.")
     */
    private $email;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @groups({"customers_read", "invoices_read"})
     */
    private $company;

    /**
     * @ORM\OneToMany(targetEntity=Invoice::class, mappedBy="customer")
     * @groups({"customers_read"})
     * test de la fonction subresource
     * @ApiSubresource
     */
    private $invoices;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="customers")
     * @groups({"customers_read"})
     * @Assert\NotBlank(message = "L'utilisateur est obligatoire.")
     */
    private $user;

    public function __construct()
    {
        $this->invoices = new ArrayCollection();
    }

    /**
     * Permet de recuperer le montant total des factures.
     *@groups({"customers_read"})
     * @return float
     */
    public function getTotalAmount(): float {
        return array_reduce($this->invoices->toArray(), function ($total, $invoice) {
            return $total + $invoice->getAmount();
        }, 0);
    }

       /**
     * Permet de recuperer le montant total non payé.
     *@groups({"customers_read"})
     * @return float
     */
    public function getUnpaidAmount(): float {
        return array_reduce($this->invoices->toArray(), function ($total, $invoice) {
            return $total + ($invoice->getStatus() === "PAID" || $invoice->getStatus() === "CANCELLED" ? 0 :
        $invoice->getAmount());
        }, 0);
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): self
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(string $lastName): self
    {
        $this->lastName = $lastName;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getCompany(): ?string
    {
        return $this->company;
    }

    public function setCompany(?string $company): self
    {
        $this->company = $company;

        return $this;
    }

    /**
     * @return Collection|Invoice[]
     */
    public function getInvoices(): Collection
    {
        return $this->invoices;
    }

    public function addInvoice(Invoice $invoice): self
    {
        if (!$this->invoices->contains($invoice)) {
            $this->invoices[] = $invoice;
            $invoice->setCustomer($this);
        }

        return $this;
    }

    public function removeInvoice(Invoice $invoice): self
    {
        if ($this->invoices->contains($invoice)) {
            $this->invoices->removeElement($invoice);
            // set the owning side to null (unless already changed)
            if ($invoice->getCustomer() === $this) {
                $invoice->setCustomer(null);
            }
        }

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }
}
